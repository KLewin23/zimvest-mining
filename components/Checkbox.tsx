import React from 'react';
import { MdCheck } from 'react-icons/md';
import styles from '../styles/components/Checkbox.module.scss';

interface CheckboxProps {
    label?: string;
    checked: boolean;
    onClick: () => void;
    children?: React.ReactNode;
    error?: boolean;
    checkColor?: string;
    backgroundColor?: string;
    borderColor?: string;
}

const Checkbox = ({ label, checked, onClick, children, error, checkColor, backgroundColor, borderColor }: CheckboxProps): JSX.Element => {
    return (
        <div className={styles.main}>
            <button
                type={'button'}
                style={{ borderColor: error ? '#ec4c4c' : borderColor || '#d9d9d9', backgroundColor: backgroundColor || 'white' }}
                onClick={() => onClick()}
            >
                <MdCheck color={checked ? checkColor || 'black' : 'transparent'} />
            </button>
            {label ? <h4>{label}</h4> : children || ''}
        </div>
    );
};

export default Checkbox;
