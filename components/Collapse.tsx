import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { MdExpandLess } from 'react-icons/md';
import styles from '../styles/components/Collapse.module.scss';
import { useEventListener } from './utils';

interface Props {
    title: string;
    open: boolean;
    children: JSX.Element;
    onClick: (title: string) => void;
}

const Collapse = ({ title, open, children, onClick }: Props): JSX.Element => {
    const [collapseSize, setCollapseSize] = useState(0);
    const collapse = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCollapseSize(collapse?.current?.scrollHeight || 0);
    }, []);

    useEventListener('resize', () => {
        setCollapseSize(collapse?.current?.scrollHeight || 0);
    });

    return (
        <div
            ref={collapse}
            className={styles.collapse}
            style={{
                transition: `max-height ${collapseSize < 500 ? 0.2 : 0.4}s linear`,
                maxHeight: open ? `${collapseSize}px` : 90,
            }}
        >
            <div className={styles.title}>
                <h3 style={{ opacity: open ? 0 : 1 }}> {title}</h3>
                <button type={'button'} className={styles.expandBtn} onClick={() => onClick(title)}>
                    <MdExpandLess size={25} style={{ transform: open ? 'none' : 'rotate(-180deg)' }} />
                </button>
            </div>
            {cloneElement(children, { style: { opacity: open ? 1 : 0 } })}
        </div>
    );
};

export default Collapse;
