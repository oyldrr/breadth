# 📖 breadth - Speed Reading Web Application

**breadth** is a modern, open-source speed-reading web application designed to enhance reading efficiency using **Rapid Serial Visual Presentation (RSVP)**. By displaying words one at a time at a user-defined speed, breadth helps users read faster while maintaining focus.

With features like PDF text extraction, customizable display settings, and progress tracking, **breadth** is perfect for students, professionals, or anyone looking to accelerate their reading.

🌐 **Live Demo**: [take a breadth](https://oyldrr.github.io/breadth)

---

## 🚀 Features

- **RSVP Reading Mode**  
  Displays words sequentially at a customizable speed (minimum 50 WPM) to boost reading speed and focus.

- **PDF Text Extraction**  
  Drag-and-drop PDF files to extract text for immediate reading using `pdf.js`.

- **Customizable Interface**  
  Adjust font size (20px to 100px), background color, and text color for a personalized experience.

- **Progress Tracking**  
  Save reading progress and manage previously saved texts with local storage, including last-read word and timestamp.

- **Word Selection**  
  Choose a specific starting word to begin reading from any point in the text.

- **Responsive Design**  
  Optimized for seamless use on both desktop and mobile devices.

- **Interactive Controls**  
  Play, pause, skip forward/backward, toggle fullscreen, and hide controls using keyboard shortcuts or on-screen buttons.

- **Error Handling**  
  User-friendly error messages for invalid inputs or unsupported file types.

---

## 🛠️ Installation

breadth is a **client-side web application** that runs in any modern web browser without server-side dependencies.

### 1. Clone the Repository

```bash
git clone https://github.com/oyldrr/breadth.git
```

### 2. Open the Application

Navigate to the project directory and open `index.html` in your browser (Chrome, Firefox, or Edge recommended).

### 3. Dependencies

No local installation required. breadth uses CDN-hosted libraries:

- [jQuery](https://jquery.com/) – DOM manipulation
- [Font Awesome](https://fontawesome.com/) – Icons
- [pdf.js](https://mozilla.github.io/pdf.js/) – PDF text extraction

---

## 📚 Usage

### 🔤 Input Text

- Paste text into the provided textarea  
- **or** drag-and-drop a PDF file to extract text automatically.

### ⚙️ Configure Settings

- Set reading speed (Words Per Minute)
- Customize font size, background color, and text color via the control panel

### ▶️ Start Reading

- Click **Start** to enter RSVP mode
- Optionally select a specific word to begin from

### 🎛️ Navigate and Control

#### ⌨️ Keyboard Shortcuts

- `Space` – Play/Pause reading  
- `← / →` – Previous/Next word  
- `Enter` – Toggle fullscreen  
- `H` – Hide controls  
- `Esc` – Close reading modal  
- `B` – Open background color picker  
- `T` – Open text color picker  
- `F` – Focus font size selector

#### 🖱️ On-screen Controls

Use the visual buttons for all controls as well.

### 💾 Manage Texts

- Save texts to local storage
- View them under **Previous Texts**
- Delete or continue from last-read word

---

## 🖼️ Screenshots
<img width="1944" height="1258" alt="Main Interface" src="https://github.com/user-attachments/assets/cb4e7b0b-1ae5-4c41-8405-3cb52c59b57a" />
<img width="1944" height="1258" alt="RSVP Screen" src="https://github.com/user-attachments/assets/6c7ff447-f3bf-478d-8f1c-5e17ee8fc811" />

---

## 🤝 Contributing

We welcome contributions to improve **breadth**!

### Steps:

1. Fork the repository  
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch  
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request with a clear description

📄 Please read `CONTRIBUTING.md` for detailed guidelines.

---

## 🐞 Reporting Issues

Found a bug or have a feature request?  
Please open an issue on the [GitHub Issues page](https://github.com/oyldrr/breadth/issues).

---

## ⚠️ Known Issues

- PDF extraction may fail for large or complex PDFs due to limitations in `pdf.js`.
- Limited support for older browsers (e.g., Internet Explorer 11) due to modern JavaScript features.

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using:

- [jQuery](https://jquery.com/)
- [Font Awesome](https://fontawesome.com/)
- [pdf.js](https://mozilla.github.io/pdf.js/)

Inspired by classic speed-reading techniques to enhance productivity and focus.

---

## 📬 Contact

For questions or feedback, feel free to reach out:  
📧 **oyldrr@gmail.com**

---

**Thank you for using breadth!**  
_Accelerate your reading today._
