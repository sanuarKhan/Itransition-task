# Book Testing Application

A web application for testing bookstore functionality by generating fake book information in multiple languages.

## Features

- Generate random book data with consistent results using seeds
- Support for multiple languages (English, German, Bengali)
- Adjustable average likes per book (0-10)
- Adjustable average reviews per book (0-10)
- Infinite scroll pagination
- Expandable book details with cover images
- Responsive design for all screen sizes

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- TanStack Query for data fetching
- Shadcn/UI components
- Tailwind CSS for styling
- Axios for API calls

### Backend

- Node.js + Express
- Faker.js for data generation
- CORS for cross-origin support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task5
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

3. Start the development servers:

```bash
# Start backend server (from backend directory)
pnpm dev

# Start frontend development server (from frontend directory)
pnpm dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Usage

1. Select your preferred language from the dropdown
2. Either enter a seed value manually or generate a random one
3. Adjust the average likes and reviews using the sliders
4. Scroll through the generated books
5. Click on any book row to view detailed information
6. Keep scrolling to load more books automatically

## API Endpoints

### GET /api/books

Returns a list of generated books

Query Parameters:

- `seed` (required): Seed value for consistent random generation
- `page` (optional, default: 0): Page number for pagination
- `langCode` (optional, default: "en"): Language code (en, de, bn)
- `likesAvg` (optional, default: 0): Average number of likes per book
- `reviewsAvg` (optional, default: 0): Average number of reviews per book

## Project Structure

```
task5/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── App.tsx
    └── index.html
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
