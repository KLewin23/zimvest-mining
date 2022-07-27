import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { FaBolt, FaCogs, FaEnvira, FaHive, FaSnowplow } from 'react-icons/fa';
import { Request } from '../../components/types';
import { getItems, getUser, ItemSelectorTab, Marketplace, Product, User } from '../../components';

interface Props {
    user?: User;
    products?: Request<Product>[];
}

const extendedSidebarLayout: ItemSelectorTab[] = [
    {
        title: 'Machinery',
        icon: FaSnowplow,
        subList: ['Mining Drills', 'Blasting Tools', 'Earth Movers', 'Crushing Equipment', 'Screening Equipment'],
        tabDefaultState: true,
    },
    {
        title: 'Consumables',
        icon: FaCogs,
        subList: [
            'Bearings',
            'Idler Rollers',
            'Conveyors',
            'Drill bits',
            'Mining Horse',
            'Valves',
            'PPE',
            'Spare Parts',
            'Cable Hooks',
            'Other Service Providers',
        ],
        tabDefaultState: true,
    },
    {
        title: 'Services',
        icon: FaBolt,
        subList: [
            'Mining Contractors',
            'Chemical Providers',
            'Logistics',
            'Lab Testing Services',
            'Telecommunications',
            'Banking and Insurance',
            'Screening Equipment',
            'Mining Equipment',
        ],
        tabDefaultState: false,
    },
    {
        title: 'Metals',
        icon: FaHive,
        subList: ['Base Metals', 'Precious Metals', 'Minor Metals', 'Bulk Metals', 'Semi Precious Stones', 'Ferro Alloys', 'Rare Earth'],
        tabDefaultState: false,
    },
    {
        title: 'Fertilizers',
        icon: FaEnvira,
        subList: ['Phosphate', 'Potash', 'Nitrogen', 'DAP', 'Map', 'SSP', 'TSP', 'Urea'],
        tabDefaultState: false,
    },
];

const Products = ({ user, products }: Props): JSX.Element => {
    return <Marketplace pageName={'product'} user={user} items={products} sideBarLayout={extendedSidebarLayout} />;
};

export default Products;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const user = await getUser<Props>(req, { props: {} });
    const products = await getItems('product', 1, 'Popularity', []);
    return {
        props: {
            ...user.props,
            products,
        },
    };
};
