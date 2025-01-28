document.addEventListener('DOMContentLoaded', () => {
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

    // Socket.io setup
    const socket = io();

    // User data
    let currentUser = {
        username: 'Guest',
        profilePicture: 'default-profile.png',
    };

    // Show default section
    showSection('videos');

    // Event listeners for navigation
    uploadBtn.addEventListener('click', () => showSection('upload'));
    profileBtn.addEventListener('click', () => showSection('profile'));
    videosBtn.addEventListener('click', () => showSection('videos'));
    messagesBtn.addEventListener('click', () => showSection('messages'));

    // Function to show a section
    function showSection(sectionName) {
        Object.values(sections).forEach(sec => (sec.style.display = 'none'));
        sections[sectionName].style.display = 'block';
    }

    // Registration form submission
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const phone = document.getElementById('phone').value;

        // Update current user
        currentUser.username = username;

        // Emit registration event
        socket.emit('register', { username, phone });

        alert('Registration successful!');
        registrationForm.reset();
        showSection('profile');
        updateProfile();
    });

    // Update profile display
    function updateProfile() {
        const profileUsername = document.getElementById('profile-username');
        const profilePicture = document.getElementById('profile-picture');
        profileUsername.textContent = currentUser.username;
        profilePicture.src = currentUser.profilePicture;
    }

    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    editProfileBtn.addEventListener('click', () => {
        alert('Edit Profile feature coming soon!');
    });

    // Upload form submission (using Stocker.io)
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', async event => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const videoFile = document.getElementById('video-file').files[0];

        if (videoFile) {
            const formData = new FormData();
            formData.append('file', videoFile);
            formData.append('title', title);
            formData.append('description', description);

            try {
                // Upload video to Stocker.io
                const response = await uploadToStocker(formData);
                console.log('Uploaded to Stocker.io:', response);

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
                console.error('Error uploading to Stocker.io:', error);
            }
        }
    });

    // Add uploaded video to gallery
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

    // Open chat interface with comments
    function openChatWithComments(videoId) {
        alert(`Messaging feature for video ${videoId} coming soon!`);
    }

    // Message form submission
    const messageForm = document.getElementById('message-form');
    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const messageText = document.getElementById('message-input').value;

        // Emit chat message event
        socket.emit('chatMessage', {
            sender: currentUser.username,
            message: messageText,
        });

        document.getElementById('message-input').value = '';
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

    // Load existing videos from Stocker.io
    async function loadVideosFromStocker() {
        try {
            const videos = await fetchAllFiles();
            videos.forEach(video => {
                addVideoToGallery({
                    id: video.id,
                    title: video.metadata.title || 'Untitled',
                    description: video.metadata.description || '',
                    videoURL: video.url,
                });
            });
        } catch (error) {
            console.error('Error loading videos from Stocker.io:', error);
        }
    }

    // Initialize application
    loadVideosFromStocker();
    updateProfile();
});
