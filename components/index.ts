export type {
    ProductSideBarValues,
    ItemSelectorTab,
    User,
    MarketplaceProduct,
    Collection,
    Joined,
    MarketplacePage,
    MarketplaceType,
    MineItemResponse,
    BasicItemResponse,
    AccountFormValues,
    UserProducts,
    MarketplaceMine,
    MarketplaceVacancy,
    ServerResponse,
    UserProductBasic,
    UserProductSalary,
    UserProductPrice,
    MarketplaceService,
} from './types';
export {
    userApiUrl,
    fetchUser,
    getItems,
    getUserInfo,
    getItem,
    getProducts,
    cloudflareLoader,
    getInCart,
    getCollectionCount,
    getCollection,
} from './utils';
export { useEventListener, useWindowWidth, useCartCount } from './hooks';
export { metals, productExtendedSidebarLayout, serviceExtendedSidebarLayout } from './data';
export { default as Advert } from './Advert';
export { default as BannerPage } from './BannerPage';
export { default as Checkbox } from './Checkbox';
export { default as Collapse } from './Collapse';
export { default as Footer } from './Footer';
export { default as Modal } from './Modal';
export { default as Page } from './Page';
export { default as Marketplace } from './Marketplace';
export { default as Item } from './Item';
export { default as Select } from './Select';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        google: any;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        googleTranslateElementInit: any;
    }
}
