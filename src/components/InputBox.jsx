import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiFile } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

const InputBox = ({ onSendMessage, isDisabled }) => {
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const sendSound = new Audio('/assets/sounds/send.mp3');

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() || file) {
            // Play send sound
            sendSound.play().catch(error => console.log('Send sound error:', error));

            onSendMessage({ text: input, file });
            setInput("");
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <form
            onSubmit={handleSend}
            className="flex flex-col items-center justify-center bg-white p-6 md:p-0 pb-7 md:pb-12 rounded-lg shadow-lg space-y-4"
        >
            {previewUrl && (
                <div className="relative w-full flex justify-center mb-4">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 w-full rounded-lg object-contain"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                        ✕
                    </button>
                </div>
            )}
            <div className="flex items-center justify-center w-full space-x-3 sm:space-x-4">
                <input
                    type="text"
                    className="w-full sm:w-3/4 lg:w-2/3 border-2 border-[#ab252c] rounded-lg px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base lg:text-lg focus:outline-none  focus:ring-1 focus:ring-[#ab252c] focus:border-[#ab252c] placeholder:text-[#ab252c]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isDisabled} // Disable input when processing
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isDisabled} // Disable file input when processing
                />
                <label
                    htmlFor="file-upload"
                    className={`p-3 sm:p-4 bg-[#ab252c] text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 transform hover:scale-110 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
                >
                    <FiFile size={20} />
                </label>
                <button
                    type="submit"
                    className={`p-3 sm:p-4 bg-[#ab252c] text-white rounded-lg flex items-center justify-center transition-all duration-500 transform hover:scale-110 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
                    disabled={isDisabled} // Disable send button when processing
                >
                    <IoSend size={20} />
                </button>
            </div>
        </form>
    );
};

InputBox.propTypes = {
    onSendMessage: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired, // Added prop type validation for isDisabled
};

export default InputBox;