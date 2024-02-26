import { building } from "$app/environment";

// place files you want to import through the `$lib` alias in this folder.
let url: string;
if (building) {
    url = "http://web:5000"
} else {
    url = "http://localhost:5000"
}
export const VIDEO_PIPELINE_URL = url;
