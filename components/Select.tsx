/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { cloneElement, ReactNode, useEffect, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import styles from '../styles/components/Select.module.scss';
import { useEventListener } from './hooks';

interface Props {
    icon?: JSX.Element;
    title: string;
    children: ReactNode;
    selectedOption: string;
    onClick: (selectedOption: string) => void;
}

const Select = ({ icon, title, children, selectedOption, onClick }: Props): JSX.Element => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const [minWidth, setMinWidth] = useState(0);

    useEventListener('click', e => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    });

    useEffect(() => {
        setMinWidth(dropRef?.current?.scrollWidth || 0);
    }, []);

    useEventListener('resize', () => {
        setMinWidth(dropRef?.current?.scrollWidth || 0);
    });

    return (
        <div ref={selectRef} className={styles.main} style={{ minWidth: `${minWidth}px` }}>
            <span>{icon}</span>
            <p>{selectedOption || title}</p>
            <button type={'button'} onClick={() => setOpen(!open)}>
                <FaCaretDown color={'#bbbbbb'} />
            </button>
            <div
                ref={dropRef}
                style={{ opacity: open ? 1 : 0, top: open ? 'calc(100% + 3px)' : 'calc(100% )', pointerEvents: open ? 'all' : 'none' }}
            >
                {(Array.isArray(children) ? children : [children]).map(child => {
                    if (child.type !== (<option />).type) throw new Error('Children must be type of option');
                    return cloneElement(child, {
                        ...child.props,
                        onClick: () => {
                            onClick(child.props.children);
                            setOpen(false);
                        },
                    });
                })}
            </div>
        </div>
    );
};

export default Select;
