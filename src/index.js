import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import MusicList from "./pages/MusicList";
import CreateMusic from "./pages/CreateMusic";
import ShareMusic from "./pages/ShareMusic";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MusicList />} />
                <Route path="/edit/:id" element={<CreateMusic />} />
                <Route path="/share/:id" element={< ShareMusic />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);