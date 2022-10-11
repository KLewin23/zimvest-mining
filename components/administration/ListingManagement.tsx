import axios from 'axios';
import { IoTrashSharp } from 'react-icons/io5';
import { Column, useTable } from 'react-table';
import { useMutation, useQuery } from 'react-query';
import React, { CSSProperties, useState } from 'react';
import { ItemStripped, ListingsResult, MarketplacePage } from '../types';
import { getListings, userApiUrl } from '../utils';
import PageSelector from '../PageSelector';
import Modal from '../Modal';
import Select from '../Select';
import styles from '../../styles/administration.module.scss';

interface Props {
    initialListings?: ListingsResult;
    style?: CSSProperties;
}

const ListingManagement = ({ initialListings, style }: Props): JSX.Element => {
    const [listingsPage, setListingsPage] = useState(1);
    const [itemType, setItemType] = useState<MarketplacePage>('product');
    const [confirmModal, setConfirmModal] = useState<[string, number] | null>(null);

    const { data: listings, refetch: refetchListings } = useQuery<{ listings: ItemStripped[]; pages: number }>(
        ['Listings', listingsPage, itemType],
        () => getListings(itemType, listingsPage),
        {
            initialData: initialListings,
            keepPreviousData: true,
        },
    );
    const deleteListing = useMutation((id: number) => axios.delete(`${userApiUrl}/listing/${itemType}/${id}`, { withCredentials: true }), {
        onSuccess: async () => {
            await refetchListings();
            setConfirmModal(null);
        },
    });

    const userManagementColumns = React.useMemo(
        (): Column<ItemStripped>[] => [
            { Header: 'id', accessor: 'id' },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Views', accessor: 'views' },
            { Header: 'Value', accessor: 'value' },
        ],
        [],
    );

    const listingsTable = useTable({
        columns: userManagementColumns,
        data: listings?.listings || [],
        initialState: {
            hiddenColumns: ['id'],
        },
    });

    return (
        <div className={styles.userManagement} style={{ ...style }}>
            <Modal open={confirmModal !== null} className={styles.confirmModal}>
                <h3>Are you sure you wish to delete {confirmModal ? confirmModal[0] : ''}</h3>
                <div>
                    <button type={'button'} onClick={() => setConfirmModal(null)}>
                        Cancel
                    </button>
                    <button
                        type={'button'}
                        onClick={() => {
                            if (confirmModal) return deleteListing.mutate(confirmModal[1]);
                            return undefined;
                        }}
                        className={deleteListing.isLoading ? styles.loading : ''}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
            <h2>User Management</h2>
            <Select title={'Item type'} onClick={item => setItemType(item as MarketplacePage)} selectedOption={itemType}>
                <option>product</option>
                <option>mine</option>
                <option>service</option>
                <option>vacancy</option>
            </Select>
            <table className={styles.table} {...listingsTable.getTableProps()}>
                <thead>
                    {listingsTable.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                            <th>Delete</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...listingsTable.getTableBodyProps()}>
                    {listingsTable.rows.map(row => {
                        listingsTable.prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                                <td className={styles.actions}>
                                    <button type={'button'} onClick={() => setConfirmModal([row.original.title, row.original.id])}>
                                        <IoTrashSharp size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <PageSelector totalPages={listings?.pages || 1} currentPage={listingsPage} onPageChange={p => setListingsPage(p)} />
        </div>
    );
};

export default ListingManagement;
