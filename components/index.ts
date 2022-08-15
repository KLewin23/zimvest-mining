export type { ProductSideBarValues, ItemSelectorTab, User, MarketplaceProduct } from './types';
export { userApiUrl, fetchUser, getItems, getUserInfo } from './utils';
export { useEventListener, useWindowWidth } from './hooks';
export { default as Advert } from './Advert';
export { default as BannerPage } from './BannerPage';
export { default as Checkbox } from './Checkbox';
export { default as Collapse } from './Collapse';
export { default as Footer } from './Footer';
export { default as Modal } from './Modal';
export { default as Page } from './Page';
export { default as Marketplace } from './Marketplace';
export { default as Item } from './Item';

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
