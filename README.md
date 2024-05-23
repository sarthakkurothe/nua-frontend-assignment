# Frontend Assignment - Admin Dashboard

This project is an Admin Dashboard designed to display book records in a tabular format. The data is fetched from the Open Library API and includes various features such as pagination, sorting, and additional brownie point features. The dashboard is built using ReactJS and leverages component libraries for enhanced UI/UX.


## Features
- **Data Fetching** : Book records are populated from the Open Library API.
- **Columns** : The table includes the following columns:
   - Ratings Average
   - Author Name
   - Title
   - First Publish Year
   - Subject
   - Author Birth Date
   - Author Top Work
- **Pagination**: 
   - Default view shows 10 books per page.
   - Users can change the view to display 50 or 100 records per page.
- **Sorting**: Users can sort columns in ascending or descending order.
- **Additional Features**:
   - **Support for editing a row entry**:
     - Click the edit button next to the row you wish to edit.
     - A modal or inline form will appear allowing you to update the row data.
   - **Search books by author**:
     - Use the search bar at the top of the table to filter books by author name.
     - The table will dynamically update to show matching records.
   - **Download the current results in a CSV file**:
     - Click the download button to get the current table data in CSV format.
     - The CSV file will include all visible records and columns.
   - **Hosting the dashboard online**:
     - Hosted the dashboard using platform like Vercel.
     - URL is accessible and the dashboard is fully functional online.

## Technology Stack
- **Front End**: ReactJS
- **Component Library**: Any suitable library (e.g., Material-UI, Ant Design)
- **API**: Open Library API

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/sarthakkurothe/nua-frontend-assignment
    ```
2. Navigate to the project directory:
    ```bash
    cd nua-frontend-assignment-main
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm start
    ```

## API Reference
Open Library API documentation can be found [here](https://openlibrary.org/developers/api).

## Usage
- Open your browser and go to `http://localhost:3000`.
- View the table with book records.
- Use pagination controls to navigate through pages.
- Click on column headers to sort the data.
- Use the search bar to find books by author.
- Edit entries by clicking on the edit button next to each row.
- Download the table data in CSV format using the download button.

## Brownie Points
- **Editing a Row Entry**: Click the edit button next to the row you wish to edit.
- **Search Books by Author**: Use the search bar at the top of the table to filter books by author name.
- **Download CSV**: Click the download button to get the current table data in CSV format.
- **Hosting**: Hosted the dashboard using platforms like Vercel.

## Contributing
- Fork the repository.
- Create a new branch (`git checkout -b feature-branch`).
- Make your changes.
- Commit your changes (`git commit -m 'Add some feature'`).
- Push to the branch (`git push origin feature-branch`).
- Create a new Pull Request.

## Contact
For any questions or feedback, please open an issue on the GitHub repository or contact me at [reachsarthakkurothe@gmail.com].

---

Thank you for using this Admin Dashboard!


