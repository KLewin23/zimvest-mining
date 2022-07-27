import React, { RefObject, useEffect, useRef, useState } from 'react';
import { MdOutlineExpandLess, MdSearch } from 'react-icons/md';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import Checkbox from './Checkbox';
import type { ItemSelectorTab } from '.';
import styles from '../styles/components/ItemSelector.module.scss';
import { useEventListener } from './hooks';

interface Props {
    itemSelectorLayout: ItemSelectorTab[];
    onChange: (data: FieldValues) => void;
}

const ItemSelector = ({ itemSelectorLayout, onChange }: Props): JSX.Element => {
    const { control, getValues } = useFormContext();
    const tabList = useRef<HTMLDivElement>(null);

    const calcTabHeights = (list: RefObject<HTMLDivElement>) => {
        if (list.current?.children === undefined) return null;
        return [...list.current.children].map(i => {
            if (i.lastChild) {
                const childArray = [...i.children];
                return childArray[childArray.length - 1].scrollHeight;
            }
            return 0;
        });
    };

    const [tabHeight, setTabHeight] = useState(calcTabHeights(tabList));
    const [tabStatus, setTabStatus] = useState<Record<number, boolean>>(() =>
        itemSelectorLayout.reduce((acc, tab, index) => ({ ...acc, [index]: itemSelectorLayout[index].tabDefaultState }), {}),
    );

    useEffect(() => setTabHeight(calcTabHeights(tabList)), []);

    useEventListener('resize', () => setTabHeight(calcTabHeights(tabList)));

    return (
        <div className={styles.productSearch}>
            <div className={styles.search}>
                <MdSearch size={24} color={'#95979C'} />
                <input type={'text'} placeholder={'Search Products'} />
            </div>
            <div className={styles.list} ref={tabList}>
                {itemSelectorLayout.map((section, sectionIndex) => (
                    <section>
                        <div>
                            <section.icon size={24} color={'#ED7830'} />
                            <p>{section.title}</p>
                            <button
                                type={'button'}
                                onClick={() => {
                                    setTabStatus({ ...tabStatus, [sectionIndex]: !tabStatus[sectionIndex] });
                                }}
                            >
                                <MdOutlineExpandLess
                                    style={{ transform: tabStatus[sectionIndex] ? 'rotate(0deg)' : 'rotate(-180deg)' }}
                                    size={25}
                                    color={'#95979C'}
                                />
                            </button>
                        </div>
                        <div style={{ height: tabStatus[sectionIndex] && tabHeight ? `${tabHeight[sectionIndex]}px` : 0 }}>
                            {section.subList.map(subItem => (
                                <Controller
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
