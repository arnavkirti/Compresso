# Compresso - File Compression Web Application

A full-stack web application that allows users to upload files and apply various data compression algorithms including Huffman Coding, Run-Length Encoding (RLE), and LZ77. The application provides detailed compression statistics, visualization, and the ability to download processed files.

## 🚀 Features

### Core Functionality
- **File Upload**: Support for any file type (text, image, binary) up to 50MB
- **Multiple Compression Algorithms**:
  - **Huffman Coding**: Optimal for text files and source code
  - **Run-Length Encoding (RLE)**: Excellent for images with large uniform areas
  - **LZ77**: General-purpose compression for mixed content
- **Compression & Decompression**: Full bidirectional processing
- **Download Processed Files**: Download compressed or decompressed files
- **Real-time Statistics**: Compression ratio, file sizes, and processing time

### User Experience
- **Responsive UI**: Clean, minimal design built with React and Tailwind CSS
- **Dark/Light Mode**: Toggle between themes
- **Drag & Drop**: Intuitive file upload interface
- **Algorithm Education**: Detailed information about each compression algorithm
- **Interactive Charts**: Visual representation of compression statistics
- **Error Handling**: Comprehensive feedback for unsupported files or processing errors

### Technical Features
- **Modular Architecture**: Clean separation of concerns
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful backend services
- **Real-time Processing**: Efficient file handling and compression
- **Cross-platform**: Works on all modern browsers

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Chart.js + React-Chart.js-2** - Data visualization
- **React Icons** - Beautiful icon library
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Server-side type safety
- **Multer** - File upload handling
- **Express** - Web framework (underlying NestJS)

### Compression Algorithms
- **Custom Implementation**: All algorithms implemented from scratch
- **Huffman Coding**: Variable-length coding based on character frequency
- **Run-Length Encoding**: Simple compression for repetitive data
- **LZ77**: Dictionary-based compression with sliding window

## 📁 Project Structure

```
webdev/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── FileUpload.tsx
│   │   │   ├── AlgorithmSelector.tsx
│   │   │   ├── CompressionResults.tsx
│   │   │   ├── StatsVisualization.tsx
│   │   │   ├── AlgorithmInfo.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions and API client
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── compression/    # Compression algorithms and services
│   │   │   ├── huffman.service.ts
│   │   │   ├── rle.service.ts
│   │   │   ├── lz77.service.ts
│   │   │   └── compression.service.ts
│   │   ├── file/           # File handling
│   │   │   └── upload.controller.ts
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Application bootstrap
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webdev
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run start:dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

## 📖 How to Use

1. **Upload a File**
   - Click the upload area or drag and drop a file
   - Files up to 50MB are supported

2. **Choose Algorithm**
   - Select from Huffman, RLE, or LZ77
   - Click the info icon for algorithm details

3. **Compress**
   - Click "Compress File" to process
   - View real-time statistics and charts

4. **Download Results**
   - Download the compressed file
   - Test decompression to verify integrity

5. **Learn More**
   - Toggle algorithm information panel
   - Explore compression statistics visualization

## 🔧 API Endpoints

### File Operations
- `POST /api/files/compress` - Compress a file
- `POST /api/files/decompress` - Decompress a file
- `GET /api/files/download/:type/:filename` - Download processed file
- `GET /api/files/algorithms` - Get available algorithms and descriptions

### Request/Response Examples

**Compression Request:**
```javascript
FormData {
  file: File,
  algorithm: "huffman" | "rle" | "lz77"
}
```

**Compression Response:**
```javascript
{
  success: true,
  data: {
    compressedData: "base64-encoded-data",
    originalSize: 1024,
    compressedSize: 512,
    compressionRatio: 50.0,
    algorithm: "huffman",
    metadata: {
      processingTime: 15,
      tree: { /* huffman tree data */ }
    }
  }
}
```

## 🧮 Algorithm Details

### Huffman Coding
- **Best for**: Text files, source code
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **How it works**: Creates variable-length codes based on character frequency

### Run-Length Encoding (RLE)
- **Best for**: Images, data with repetitive patterns
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **How it works**: Replaces consecutive identical bytes with count + value

### LZ77
- **Best for**: General-purpose compression
- **Time Complexity**: O(n²) worst case, O(n) average
- **Space Complexity**: O(n)
- **How it works**: Uses sliding window to find and reference previous occurrences

## 🎨 Features in Detail

### User Interface
- **Modern Design**: Clean, minimal interface with attention to detail
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: Keyboard navigation and screen reader support

### File Handling
- **Drag & Drop**: Intuitive file upload experience
- **File Validation**: Size and type checking with clear error messages
- **Progress Feedback**: Loading states and processing indicators
- **Error Recovery**: Graceful handling of failed operations

### Data Visualization
- **Compression Charts**: Doughnut and bar charts for size comparison
- **Statistics Dashboard**: Key metrics prominently displayed
- **Performance Metrics**: Processing time and efficiency indicators
- **Interactive Elements**: Hover effects and tooltips

### Educational Content
- **Algorithm Explanations**: Detailed descriptions of each algorithm
- **Complexity Analysis**: Time and space complexity information
- **Pros and Cons**: Advantages and disadvantages of each method
- **Use Case Guidance**: Recommendations for optimal algorithm selection

## 🔧 Development

### Available Scripts

**Backend (server/)**
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run tests

**Frontend (client/)**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Algorithms

1. Create a new service in `server/src/compression/`
2. Implement `compress()` and `decompress()` methods
3. Add the service to `compression.service.ts`
4. Update the frontend algorithm descriptions
5. Test thoroughly with various file types

### Deployments

1. Frontend: https://compresso-psi.vercel.app/ (Deployed on Vercel)
2. Backend: https://compresso-rku9.onrender.com (Deployed on Render)

## 🙏 Acknowledgments

- Huffman algorithm implementation based on classic computer science principles
- LZ77 implementation inspired by the original Lempel-Ziv paper
- UI design inspired by modern compression tools and file utilities
- Chart.js for beautiful data visualization
- Tailwind CSS for rapid UI development

---

**Built with ❤️ using React, NestJS, and modern web technologies**
