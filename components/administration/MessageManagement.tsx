import Link from 'next/link';
import React, { CSSProperties, useState } from 'react';
import { useQuery } from 'react-query';
import { Column, useTable } from 'react-table';
import { MessageResult, StrippedMessage } from '../types';
import { getMessages } from '../utils';
import styles from '../../styles/administration.module.scss';
import PageSelector from '../PageSelector';

interface Props {
    initialMessages?: MessageResult;
    style?: CSSProperties;
}

const MessageManagement = ({ initialMessages, style }: Props): JSX.Element => {
    const [messagesPage, setMessagesPage] = useState(1);

    const { data: messages } = useQuery<MessageResult>(['MessageList', messagesPage], () => getMessages(messagesPage), {
        initialData: initialMessages,
        keepPreviousData: true,
    });

    const userManagementColumns = React.useMemo(
        (): Column<StrippedMessage>[] => [
            { Header: 'id', accessor: 'id' },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Read', accessor: 'read' },
        ],
        [],
    );

    const messagesTable = useTable({
        columns: userManagementColumns,
        data: messages?.messages || [],
        initialState: {
            hiddenColumns: ['id'],
        },
    });

    return (
        <div className={styles.userManagement} style={{ ...style }}>
            <h2>User Management</h2>
            <table className={styles.table} {...messagesTable.getTableProps()} cellSpacing={0}>
                <thead>
                    {messagesTable.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...messagesTable.getTableBodyProps()} className={styles.highlight}>
                    {messagesTable.rows.map(row => {
                        messagesTable.prepareRow(row);
                        return (
                            <Link href={`/administration/message/${row.original.id}`} key={`Message-${row.original.id}`}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell, cellIndex) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cellIndex === 2 ? (cell.render('Cell') === false ? 'No' : 'Yes') : cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </Link>
                        );
                    })}
                </tbody>
            </table>
            <PageSelector totalPages={messages?.pages || 1} currentPage={messagesPage} onPageChange={p => setMessagesPage(p)} />
        </div>
    );
};

export default MessageManagement;
