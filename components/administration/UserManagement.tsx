import Link from 'next/link';
import React, { CSSProperties, useState } from 'react';
import { useQuery } from 'react-query';
import { Column, useTable } from 'react-table';
import styles from '../../styles/administration.module.scss';
import PageSelector from '../PageSelector';
import { StrippedUser, UsersResult } from '../types';
import { getUsers } from '../utils';

interface Props {
    initialUsers?: UsersResult;
    style?: CSSProperties;
}

const UserManagement = ({ initialUsers, style }: Props): JSX.Element => {
    const [usersPage, setUsersPage] = useState(1);

    const { data: users } = useQuery<{ users: StrippedUser[]; pages: number }>(['UserList', usersPage], () => getUsers(usersPage), {
        initialData: initialUsers,
        keepPreviousData: true,
    });

    const userManagementColumns = React.useMemo(
        (): Column<StrippedUser>[] => [
            { Header: 'id', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
        ],
        [],
    );

    const userTable = useTable({
        columns: userManagementColumns,
        data: users?.users || [],
        initialState: {
            hiddenColumns: ['id'],
        },
    });

    return (
        <div className={styles.userManagement} style={{ ...style }}>
            <h2>User Management</h2>
            <table className={styles.table} {...userTable.getTableProps()}>
                <thead>
                    {userTable.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...userTable.getTableBodyProps()} className={styles.highlight}>
                    {userTable.rows.map(row => {
                        userTable.prepareRow(row);
                        return (
                            <Link href={`/administration/user/${row.original.id}`} key={`User-${row.original.id}`}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            </Link>
                        );
                    })}
                </tbody>
            </table>
            <PageSelector totalPages={users?.pages || 1} currentPage={usersPage} onPageChange={p => setUsersPage(p)} />
        </div>
    );
};

export default UserManagement;
