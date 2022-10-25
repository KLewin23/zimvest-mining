import React, { useMemo, useState } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import Head from 'next/head';
import { AxisOptions } from 'react-charts';
import styles from '../styles/market.module.scss';
import { BannerPage, getCollectionCount, getUserInfo, keys, metalsMap, Page, Select, User, userApiUrl } from '../components';

interface Metal {
    createdAt: string;
    id: number;
    metal_name: string;
    price: number;
    updatedAt: string;
}

interface Props {
    user?: User;
    cartCount?: number;
    gold?: Metal[];
}

const Chart = dynamic(() => import('react-charts').then(mod => mod.Chart), {
    ssr: false,
});

const MarketData = ({ user, cartCount, gold }: Props): JSX.Element => {
    const [metal, setMetal] = useState('Gold');

    const { data } = useQuery<Metal[]>(
        ['Metals', metal],
        async () =>
            (await axios.get(`${userApiUrl}/metal/${keys(metalsMap).find(key => metalsMap[key] === metal)}`, { withCredentials: true }))
                .data,
        { initialData: gold || [], keepPreviousData: true },
    );

    const primaryAxis = useMemo(
        (): AxisOptions<Metal> => ({
            getValue: datum => new Date(datum.createdAt),
        }),
        [],
    );

    const secondaryAxes = useMemo(
        (): AxisOptions<Metal>[] => [
            {
                getValue: datum => 1 / (datum as Metal).price,
            },
        ],
        [],
    );

    return (
        <>
            <Head>
                <title>Zimvest - Mining Overview</title>
                <meta name={'description'} content={'Zimvest Mining Overview'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <BannerPage heading={'Market Data'} subHeading={'See how the markets are currently doing.'}>
                    <div className={styles.market}>
                        <div>
                            <Select selectedOption={metal} onClick={setMetal}>
                                {Object.values(metalsMap).map(name => (
                                    <option key={name}>{name}</option>
                                ))}
                            </Select>
                            <p>{data ? data[0].metal_name : ''}</p>
                        </div>
                        <div style={{ height: 300, width: '350px' }}>
                            {data && data[0].price ? `$${(1 / data[0].price).toFixed(2)}` : null}
                            <Chart
                                className={styles.chart}
                                options={{
                                    data: [{ label: 'idk', data: data || [] }],
                                    primaryAxis,
                                    secondaryAxes,
                                    initialHeight: 300,
                                    initialWidth: 350,
                                }}
                            />
                        </div>
                    </div>
                </BannerPage>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    const gold = (await axios.get(`${userApiUrl}/metal/XAU`, { withCredentials: true })).data;
    if ('props' in user) {
        const cartCount = await getCollectionCount('CART', { headers: { cookie: req.headers.cookie || '' } });
        return {
            props: {
                ...user.props,
                cartCount,
                gold,
            },
        };
    }
    return { props: { gold } };
};

export default MarketData;
