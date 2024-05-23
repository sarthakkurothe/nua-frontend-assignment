import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import Papa from 'papaparse';
import './BookTable.css';

const fetchAdditionalDetails = async (book) => {
  const authorName = book.authors ? book.authors[0].name : 'unknown';
  const ratingsAverage = 'N/A';

  const authorDetailsUrl = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`;
  const authorDetailsResponse = await axios.get(authorDetailsUrl);
  const authorDetails = authorDetailsResponse.data.docs[0] || {};

  const subject = 'N/A';

  return {
    ...book,
    ratings_average: ratingsAverage,
    author_birth_date: authorDetails.birth_date || 'N/A',
    author_top_work: authorDetails.top_work || 'N/A',
    subject: subject,
  };
};

const fetchBooks = async (page, pageSize) => {
  const start = page * pageSize;
  const url = `https://openlibrary.org/subjects/science.json?limit=${pageSize}&offset=${start}`;
  const response = await axios.get(url);
  const books = response.data.works;

  const detailedBooks = await Promise.all(books.map(fetchAdditionalDetails));
  return detailedBooks;
};

const BookTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setTablePageSize] = useState(10);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingRowData, setEditingRowData] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchBooks(page, pageSize).then((books) => {
      setData(books);
      setLoading(false);
    });
  }, [page, pageSize]);

  const handleEdit = useCallback((index) => {
    setEditingRowIndex(index);
    setEditingRowData(data[index]);
  }, [data]);

  const handleSave = () => {
    const updatedData = [...data];
    updatedData[editingRowIndex] = editingRowData;
    setData(updatedData);
    setEditingRowIndex(null);
    setEditingRowData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingRowData({ ...editingRowData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredData = useMemo(() => {
    return data.filter(book => {
      return book.authors && book.authors[0].name.toLowerCase().includes(searchInput.toLowerCase());
    });
  }, [data, searchInput]);

  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Author Name', accessor: 'authors[0].name' },
      { Header: 'First Publish Year', accessor: 'first_publish_year' },
      { Header: 'Subject', accessor: 'subject' },
      { Header: 'Ratings Average', accessor: 'ratings_average' },
      { Header: 'Author Birth Date', accessor: 'author_birth_date' },
      { Header: 'Author Top Work', accessor: 'author_top_work' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <button className="edit-btn" onClick={() => handleEdit(row.index)}>Edit</button>
        ),
      },
    ],
    [handleEdit]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize: statePageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: page, pageSize },
      manualPagination: true,
      pageCount: Math.ceil(100 / pageSize),
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setPage(pageIndex);
  }, [pageIndex]);

  const downloadCSV = () => {
    const fields = columns.map((col) => col.accessor);
    const csv = Papa.unparse(data, { fields });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'books.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Explore authors..."
        value={searchInput}
        onChange={handleSearchChange}
      />
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <table {...getTableProps()} className="book-table">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row);
                const isEditing = editingRowIndex === row.index;
                                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const cellValue = cell.render('Cell');
                      if (isEditing) {
                        return (
                          <td key={cell.column.id} {...cell.getCellProps()}>
                            <input
                              type="text"
                              name={cell.column.id}
                              value={editingRowData[cell.column.id] || ''}
                              onChange={handleChange}
                            />
                          </td>
                        );
                      }
                      return <
                      td key={cell.column.id} {...cell.getCellProps()}>{cellValue}</td>;
                    })}
                    {isEditing && (
                      <td>
                        <button className="save-btn" onClick={handleSave}>Save</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="csv-btn" onClick={downloadCSV}>Download CSV</button>
        </>
      )}
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={statePageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setTablePageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              Display entries {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BookTable;

               
