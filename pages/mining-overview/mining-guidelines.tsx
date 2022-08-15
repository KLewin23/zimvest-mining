import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { BannerPage, getUserInfo, Page, User } from '../../components';

interface Props {
    user?: User;
    cartCount?: number;
}

const MiningGuidelines = ({ user, cartCount }: Props): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - Mining Overview</title>
                <meta name={'description'} content={'Zimvest Mining Overview'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <BannerPage heading={'Mining Guidelines'} subHeading={'Learn more about best practices in the mining community'}>
                    <section>
                        <h2>Accessing mineral rights and opportunities in Zimbabwe</h2>
                        <ul>
                            <li>
                                Foreign investors are allowed to own 100% shareholding for mining operations in all minerals except for
                                platinum and diamonds which the foreign investor is expected to jointly own with Government on a 51%/49%
                                basis.
                            </li>
                            <li>
                                Foreign investors are expected to register a company in Zimbabwe and possess an investment certificate
                                issued by the Zimbabwe Investment Authority (Z.I.A) before starting operations. The company may then apply
                                for mineral rights from the Ministry of Mines and Mining Development.
                            </li>
                            <li>
                                Any person who is a permanent resident of Zimbabwe and above the age of 18 may take out a prospecting
                                license from any Provincial Mining Director for purposes of prospecting and registering mining claims.
                            </li>
                            <li>Each Prospecting License is valid for two years</li>
                            <li>
                                holder of a Prospecting License automatically acquires the rights of prospecting and pegging mining claims
                                in Zimbabwe
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2>Procedures and criteria of obtaining mining claims</h2>
                        <ul>
                            <li>
                                When a Prospecting License holder has identified a mineral deposit that he/she is interested in, he/she
                                appoints an agent or an Approved Prospector to peg on his behalf.
                            </li>
                            <li>
                                The Agent is required to physically peg the area by marking the deposit with a Discovery Peg. He/She should
                                also post Prospecting, Discovery and Registration Notices on the ground as guided by procedure. The notices
                                must be posted in a conspicuous manner to alert other prospectors. Before posting these notices the Agent is
                                required to give written notice to the landowner of his intention to prospect. All areas classified as not
                                open to prospecting and pegging or reserved against prospecting and pegging cannot be pegged claims, e.g.
                                cultivated lands, dip tanks, Dams, etc. 10.
                            </li>
                            <li>
                                An application for registration must be submitted to the Ministry of Mines and Mining Development,
                                Provincial Mining Director’s offices, accompanied by copies of the following attachments:
                                <ul>
                                    <li>Prospecting licenses Notification of intention to prospect to the landowner</li>
                                    <li>Prospecting Notice</li>
                                    <li>Discovery Notice (Base Minerals)</li>
                                    <li>Notification of intention to prospect to the landowner</li>
                                    <li>A map in triplicate to the scale of 1:25000</li>
                                </ul>
                            </li>
                            <li>
                                If the Provincial Mining Director is satisfied that all pegging procedures have been followed he shall issue
                                a Certificate of Registration upon payment of the gazetted fee. This allows the holder to start mining
                                operations subject to meeting other obligations such as environmental management. Within three months from
                                the date of registration the miner is required to erect permanent beacons on the ground. All precious
                                mineral claims are supposed to be continuously worked on in order to obtain renewal of title. Claims have a
                                12 month tenure after which If a mining claim is transferred or sold a Certificate of Registration After
                                Transfer shall be issued by the Ministry of Mines and Mining Development. Failure to renew title will result
                                in the forfeiture of a mining claim. Furthermore loss of title may be through cancellation upon defaulting
                                set minimum requirements or abandonment by the holder.
                            </li>
                        </ul>
                    </section>
                </BannerPage>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    return getUserInfo(req, { props: {} });
};

export default MiningGuidelines;
