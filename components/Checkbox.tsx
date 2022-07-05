import React from 'react';
import { MdCheck } from 'react-icons/md';
import styles from '../styles/components/Checkbox.module.scss';

interface CheckboxProps {
    label?: string;
    checked: boolean;
    onClick: () => void;
    children?: React.ReactNode;
    error?: boolean;
}

const Checkbox = ({ label, checked, onClick, children, error }: CheckboxProps): JSX.Element => {
    return (
        <div className={styles.main}>
            <button type={'button'} style={{ borderColor: error ? '#ec4c4c' : ' #d9d9d9' }} onClick={() => onClick()}>
                <MdCheck color={checked ? 'black' : 'transparent'} />
            </button>
            {label ? <h4>{label}</h4> : children || ''}
        </div>
    );
};

export default Checkbox;
