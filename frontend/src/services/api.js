import axios from 'axios'

// Flask backend base URL. Change this if you run Flask on a different port.
const API_BASE_URL = 'http://localhost:5000'

/**
 * Sends the regular expression to the Flask backend and returns the parsed
 * JSON result: { regex, postfix, alphabet, nfa, dfa }.
 *
 * On a 4xx response (invalid regex, empty input, ...) the backend still
 * returns JSON like { error: "..." } — we throw an Error with that message
 * so the caller can show it in the UI instead of crashing.
 */
export async function convertRegex(regex) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/convert`, { regex })
    return response.data
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error)
    }
    throw new Error(
      'Could not reach the backend. Make sure the Flask server is running on http://localhost:5000.'
    )
  }
}
