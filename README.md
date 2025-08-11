# X/Twitter Non-Follower Exporter script

simple browser script to quickly generate a `.txt` list of all the people you follow on X who dont follow you back. The script is read-only and will not perform any actions like unfollowing or interacting with accounts.

### Features

-   **Read-Only:** The script only scans and collects usernames. It does not unfollow, like, or perform any other actions. Its up to you to unfollow who you want after you get the list
-   **Automated:** Automatically scrolls through your entire "Following" list to ensure every account is checked.
-   **Simple Output:** Generates a clean `non_followers.txt` file for easy viewing.

### How to Use

1.  **Navigate to your "Following" page** on your X/Twitter profile.
    -   Example URL: `https://x.com/YourUsername/following`
2.  **Open the Developer Console** in your web browser (usually by pressing `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`).
3.  **Copy the entire `script.js` code.**
4.  **Paste the code into the Console tab** and press `Enter`.
5.  The script will automatically scroll down the page. Please keep the tab open until it finishes.
6.  Once complete, a file named `non_followers.txt` will be downloaded to your computer.

### Disclaimer

X frequently updates its user interface. If this script stops working its likely because the element selectors changed
