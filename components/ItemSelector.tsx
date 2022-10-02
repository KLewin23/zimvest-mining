import { MdClose, MdFilterAlt, MdOutlineExpandLess } from 'react-icons/md';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import Checkbox from './Checkbox';
import type { ItemSelectorTab } from './types';
import { useEventListener, useWindowWidth } from './hooks';
import styles from '../styles/components/ItemSelector.module.scss';

interface Props {
    itemSelectorLayout: ItemSelectorTab[];
    onChange?: (data: FieldValues) => void;
}

const ItemSelector = ({ itemSelectorLayout, onChange }: Props): JSX.Element => {
    const { control, getValues } = useFormContext();
    const tabList = useRef<HTMLDivElement>(null);
    const windowWidth = useWindowWidth();

    const calcTabHeights = (list: RefObject<HTMLDivElement>) => {
        if (list.current?.children === undefined) return null;
        return [...list.current.children]
            .filter(el => el.id !== 'close')
            .map(i => {
                if (i.lastChild) {
                    const childArray = [...i.children];
                    return childArray[1].scrollHeight - 60;
                }
                return 0;
            });
    };

    const [tabHeight, setTabHeight] = useState<number[] | null>();
    const [maxScreenWidth, setMaxScreenWidth] = useState(0);
    const [open, setOpen] = useState(false);
    const [tabStatus, setTabStatus] = useState<Record<number, boolean>>(() =>
        itemSelectorLayout.reduce((acc, tab, index) => ({ ...acc, [index]: itemSelectorLayout[index].tabDefaultState }), {}),
    );

    useEffect(() => {
        setMaxScreenWidth(window.innerWidth);
        setTabHeight(calcTabHeights(tabList));
    }, [open, tabList]);

    useEventListener('resize', () => {
        setMaxScreenWidth(window.innerWidth);
        setTabHeight(calcTabHeights(tabList));
    });

    return (
        <div className={styles.productSearch} style={{ pointerEvents: open || windowWidth >= 800 ? 'all' : 'none' }}>
            {windowWidth < 800 ? (
                <button type={'button'} style={{ opacity: open ? 0 : 1 }} onClick={() => setOpen(true)} className={styles.stickyTabButton}>
                    <MdFilterAlt size={20} color={'#e5e5e5'} />
                </button>
            ) : null}

            <div className={styles.list} ref={tabList} style={{ maxWidth: windowWidth < 800 ? (open ? maxScreenWidth : 0) : 'unset' }}>
                {windowWidth < 800 ? (
                    <div id={'close'} className={styles.filtersTitle}>
                        <h3>Filters</h3>
                        <button type={'button'} onClick={() => setOpen(false)} className={styles.closeButton}>
                            <MdClose size={20} />
                        </button>
                    </div>
                ) : null}
                {itemSelectorLayout.map((section, sectionIndex) => (
                    <section key={section.title}>
                        <div>
                            <section.icon size={24} color={'#ED7830'} />
                            <button
                                type={'button'}
                                onClick={() => {
                                    setTabStatus({ ...tabStatus, [sectionIndex]: !tabStatus[sectionIndex] });
                                }}
                            >
                                <p>{section.title}</p>
                                <MdOutlineExpandLess
                                    style={{ transform: tabStatus[sectionIndex] ? 'rotate(0deg)' : 'rotate(-180deg)' }}
                                    size={25}
                                    color={'#95979C'}
                                />
                            </button>
                        </div>
                        <div
                            style={{
                                height: tabStatus[sectionIndex] && tabHeight ? `${tabHeight[sectionIndex]}px` : 0,
                            }}
                        >
                            {section.subList.map(subItem => (
                                <Controller
                                    key={`${section.title}.${
                                        subItem === 'Screening Equipment' && section.title === 'Services'
                                            ? 'Screening Equipment Service'
                                            : subItem
                                    }`}
                                    control={control}
                                    defaultValue={false}
                                    name={`${section.title}.${
                                        subItem === 'Screening Equipment' && section.title === 'Services'
                                            ? 'Screening Equipment Service'
                                            : subItem
                                    }`}
                                    rules={{ validate: { isTrue: value => value } }}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onClick={() => {
                                                field.onChange(!field.value);
                                                if (!onChange) return;
                                                onChange(getValues());
                                            }}
                                            backgroundColor={field.value ? '#ED7830' : 'white'}
                                            checkColor={'white'}
                                            borderColor={field.value ? 'transparent' : 'black'}
                                        >
                                            <h4 style={{ fontWeight: field.value ? '600' : 'normal' }}>{subItem}</h4>
                                        </Checkbox>
                                    )}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default ItemSelector;

//    {/*<div className={styles.search} style={{ visibility: 'hidden' }}>*/}
//             {/*    <MdSearch size={24} color={'#95979C'} />*/}
//             {/*    <input type={'text'} placeholder={'Search Products'} />*/}
//             {/*</div>*/}
