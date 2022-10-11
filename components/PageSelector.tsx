import React from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import styles from '../styles/components/PageSelector.module.scss';

interface Props {
    totalPages: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}

const PageSelector = ({ totalPages, currentPage, onPageChange }: Props): JSX.Element => {
    return (
        <div className={styles.main}>
            {currentPage !== 1 ? (
                <button type={'button'} onClick={() => onPageChange(currentPage - 1)}>
                    <MdNavigateBefore size={17} />
                </button>
            ) : null}
            {Array.from(Array(totalPages)).map((_, index) => (
                <button
                    type={'button'}
                    key={`pageButton-${index}`}
                    style={{ backgroundColor: currentPage === index + 1 ? '#eaeaea' : 'white' }}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            {currentPage !== totalPages ? (
                <button type={'button'} onClick={() => onPageChange(currentPage + 1)}>
                    <MdNavigateNext size={17} />
                </button>
            ) : null}
        </div>
    );
};

export default PageSelector;
