import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FaBolt, FaCogs, FaEnvira, FaHive, FaSnowplow } from 'react-icons/fa';
import { Collection, Joined } from '../../../components/types';
import { getItems, getUserInfo, ItemSelectorTab, Marketplace, MarketplaceProduct, User } from '../../../components';
import { getWishlist } from '../../../components/utils';

interface Props {
    user?: User;
    products: Joined<MarketplaceProduct>[];
    cartCount?: number;
    wishlist?: Collection;
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

const Products = ({ user, products, cartCount, wishlist }: Props): JSX.Element => {
    return (
        <Marketplace
            pageName={'product'}
            user={user}
            items={products}
            sideBarLayout={extendedSidebarLayout}
            cartCount={cartCount || 0}
            wishlist={wishlist}
        />
    );
};

export default Products;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const products = await getItems<MarketplaceProduct>('product', 1, 'Popularity', []);
    const wishlist = await getWishlist({ headers: { cookie: req.headers.cookie || '' } }, 'product');

    return {
        props: {
            products,
            ...(user && 'props' in user ? user.props : {}),
            wishlist: wishlist || { products: [], mines: [] },
        },
    };
};
