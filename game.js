// game.js

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Socket.io setup
    const socket = io();

    // User data
    let currentUser = {
        username: 'Guest',
        profilePicture: 'default-profile.png',
    };

    // Setup functions
    setupNavigation();
    setupForms(socket, currentUser);
    setupEventListeners(socket, currentUser);
    loadVideosFromSocket(socket);
    updateProfile(currentUser);
}

function setupNavigation() {
    // Navigation buttons
    const uploadBtn = document.getElementById('upload-btn');
    const profileBtn = document.getElementById('profile-btn');
    const videosBtn = document.getElementById('videos-btn');
    const messagesBtn = document.getElementById('messages-btn');

    // Sections
    const sections = {
        registration: document.getElementById('registration-section'),
        upload: document.getElementById('upload-section'),
        profile: document.getElementById('profile-section'),
        videos: document.getElementById('videos-section'),
        messages: document.getElementById('messages-section'),
    };

    // Show default section
    showSection('registration');

    // Event listeners for navigation
    uploadBtn.addEventListener('click', () => showSection('upload'));
    profileBtn.addEventListener('click', () => showSection('profile'));
    videosBtn.addEventListener('click', () => showSection('videos'));
    messagesBtn.addEventListener('click', () => showSection('messages'));

    function showSection(sectionName) {
        Object.values(sections).forEach(sec => (sec.style.display = 'none'));
        sections[sectionName].style.display = 'block';
    }
}

function setupForms(socket, currentUser) {
    // Registration form submission
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (username && phone) {
            // Update current user
            currentUser.username = username;

            // Emit registration event
            socket.emit('register', { username, phone });

            alert('Registration successful!');
            registrationForm.reset();
            showSection('profile');
            updateProfile(currentUser);
        } else {
            alert('Please enter both username and phone number.');
        }
    });

    // Upload form submission
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', async event => {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const videoFile = document.getElementById('video-file').files[0];

        if (videoFile && title && description) {
            const formData = new FormData();
            formData.append('file', videoFile);
            formData.append('title', title);
            formData.append('description', description);

            try {
                // Upload video to server (placeholder function)
                const response = await uploadVideoToServer(formData);

                // Add to gallery
                addVideoToGallery({
                    id: response.id,
                    title: response.title,
                    description: response.description,
                    videoURL: response.url,
                });

                uploadForm.reset();
                showSection('videos');
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            alert('Please fill in all fields and select a video file.');
        }
    });

    // Message form submission
    const messageForm = document.getElementById('message-form');
    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const messageText = document.getElementById('message-input').value.trim();

        if (messageText) {
            // Emit chat message event
            socket.emit('chatMessage', {
                sender: currentUser.username,
                message: messageText,
            });

            document.getElementById('message-input').value = '';
        } else {
            alert('Please enter a message.');
        }
    });
}

function setupEventListeners(socket, currentUser) {
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    editProfileBtn.addEventListener('click', () => {
        alert('Edit Profile feature coming soon!');
    });

    // Handle comment and share buttons
    document.body.addEventListener('click', event => {
        if (event.target.classList.contains('comment-btn')) {
            const videoId = event.target.dataset.videoId;
            openChatWithComments(videoId);
        } else if (event.target.classList.contains('share-btn')) {
            const videoURL = event.target.dataset.videoUrl;
            navigator.clipboard.writeText(videoURL).then(() => {
                alert('Video URL copied to clipboard!');
            });
        }
    });

    // Receive chat messages
    socket.on('chatMessage', data => {
        const messageList = document.getElementById('messages');
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.textContent = `${data.sender}: ${data.message}`;
        messageList.appendChild(messageItem);
        messageList.scrollTop = messageList.scrollHeight;
    });
}

function updateProfile(currentUser) {
    const profileUsername = document.getElementById('profile-username');
    const profilePicture = document.getElementById('profile-picture');
    profileUsername.textContent = currentUser.username;
    profilePicture.src = currentUser.profilePicture;
}

function addVideoToGallery(videoData) {
    const videoGallery = document.getElementById('videos');
    const videoItem = document.createElement('div');
    videoItem.classList.add('video-item');
    videoItem.innerHTML = `
        <h3>${videoData.title}</h3>
        <p>${videoData.description}</p>
        <video controls>
            <source src="${videoData.videoURL}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="action-buttons">
            <button class="comment-btn" data-video-id="${videoData.id}">Comment</button>
            <button class="share-btn" data-video-url="${videoData.videoURL}">Share</button>
        </div>
    `;
    videoGallery.prepend(videoItem);
}

function openChatWithComments(videoId) {
    alert(`Messaging feature for video ${videoId} coming soon!`);
}

async function loadVideosFromSocket(socket) {
    try {
        // Fetch existing videos from server (placeholder function)
        const videos = await fetchVideosFromServer();

        videos.forEach(video => {
            addVideoToGallery({
                id: video.id,
                title: video.title || 'Untitled',
                description: video.description || '',
                videoURL: video.url,
            });
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Placeholder functions for server interactions
async function uploadVideoToServer(formData) {
    // Implement actual upload logic here
    // For now, return a mock response
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                title: formData.get('title'),
                description: formData.get('description'),
                url: URL.createObjectURL(formData.get('file')),
            });
        }, 1000);
    });
}

async function fetchVideosFromServer() {
    // Implement actual fetch logic here
    // For now, return an empty array
    return [];
}

function showSection(sectionName) {
    const sections = {
        registration: document.getElementById('registration-section'),
        upload: document.getElementById('upload-section'),
        profile: document.getElementById('profile-section'),
        videos: document.getElementById('videos-section'),
        messages: document.getElementById('messages-section'),
    };
    Object.values(sections).forEach(sec => (sec.style.display = 'none'));
    sections[sectionName].style.display = 'block';
}
