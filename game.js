document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;

    // Here you would typically send this data to your back-end to register the user
    console.log('User registered:', username, phone);
    alert('Registration successful!');

    document.getElementById('registration-form').reset();
});

document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const videoFile = document.getElementById('video-file').files[0];

    if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);

        const videoGallery = document.getElementById('videos');
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';

        videoItem.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <video controls>
                <source src="${videoURL}" type="${videoFile.type}">
                Your browser does not support the video tag.
            </video>
        `;

        videoGallery.appendChild(videoItem);

        document.getElementById('upload-form').reset();
    }
});

document.getElementById('message-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;

    const messageList = document.getElementById('messages');
    const messageItem = document.createElement('div');
    messageItem.textContent = messageText;
    messageList.appendChild(messageItem);

    messageInput.value = '';

    // Here you would typically send this message to your back-end for real-time messaging
