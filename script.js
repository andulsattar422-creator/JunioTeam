// Admin Panel Password Check
function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPassword').value;
    if (passwordInput === 'JuniorTeam') {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminData();
        renderAdminMediaList();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Audio Configuration
function saveMusicSettings() {
    localStorage.setItem('pro_music_url', document.getElementById('musicUrl').value.trim());
    localStorage.setItem('pro_music_state', document.getElementById('musicStatus').value);
    alert("Audio Settings Saved!");
}

function handleLiveWebsiteAudio() {
    const audioPlayer = document.getElementById('bg-music');
    if (!audioPlayer) return;
    const savedUrl = localStorage.getItem('pro_music_url');
    const savedState = localStorage.getItem('pro_music_state');
    if (savedUrl && savedState === 'PLAY') {
        audioPlayer.src = savedUrl;
        document.addEventListener('click', () => {
            audioPlayer.play().catch(e => console.log("Audio waiting for interaction"));
        }, { once: true });
    } else {
        audioPlayer.pause();
    }
}

function loadAdminData() {
    document.getElementById('musicUrl').value = localStorage.getItem('pro_music_url') || "";
    document.getElementById('musicStatus').value = localStorage.getItem('pro_music_state') || "PAUSE";
}

// ==========================================
// DYNAMIC FEATURES & MEDIA STORAGE SYSTEM
// ==========================================
const defaultMedia = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500", title: "Welcome to JCL Tournament!", likes: 5, comments: [] }
];

function getMediaData() {
    const data = localStorage.getItem('jcl_features_media');
    return data ? JSON.parse(data) : defaultMedia;
}

function saveMediaData(data) {
    localStorage.setItem('jcl_features_media', JSON.stringify(data));
}

// Admin Se Naya Feature (Pic/Video) Add Karna
function addNewFeatureMedia() {
    const type = document.getElementById('mediaType').value;
    const url = document.getElementById('mediaUrl').value.trim();
    const title = document.getElementById('mediaTitle').value.trim() || "JCL Tournament Update";

    if (!url) return alert("Please enter a valid image or video link!");

    let currentMedia = getMediaData();
    currentMedia.push({
        id: Date.now(),
        type: type,
        url: url,
        title: title,
        likes: 0,
        comments: []
    });

    saveMediaData(currentMedia);
    document.getElementById('mediaUrl').value = '';
    document.getElementById('mediaTitle').value = '';
    renderAdminMediaList();
    alert("New Feature published successfully!");
}

// Admin Se Media Delete Karna
function deleteMediaItem(id) {
    if(confirm("Are you sure you want to delete this feature?")) {
        let currentMedia = getMediaData();
        currentMedia = currentMedia.filter(item => item.id !== id);
        saveMediaData(currentMedia);
        renderAdminMediaList();
    }
}

// Admin Panel List Rendering
function renderAdminMediaList() {
    const listContainer = document.getElementById('admin-media-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    getMediaData().forEach(item => {
        const div = document.createElement('div');
        div.style = "display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px; margin-bottom:5px; border-radius:6px; font-size:0.85rem;";
        const icon = item.type === 'image' ? '📸' : '🎥';
        div.innerHTML = `<span>${icon} ${item.title}</span> <button onclick="deleteMediaItem(${item.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>`;
        listContainer.appendChild(div);
    });
}

// Website Social Interactivity
window.likeMedia = function(id) {
    let media = getMediaData();
    const item = media.find(m => m.id == id);
    if (item) { item.likes += 1; saveMediaData(media); renderLiveFeatures(); }
}

window.addMediaComment = function(id) {
    const nameInput = document.getElementById(`comment-name-${id}`);
    const textInput = document.getElementById(`comment-text-${id}`);
    if (!nameInput.value.trim() || !textInput.value.trim()) return alert("Please fill both fields!");
    
    let media = getMediaData();
    const item = media.find(m => m.id == id);
    if (item) { 
        item.comments.push({ name: nameInput.value.trim(), text: textInput.value.trim() }); 
        saveMediaData(media); 
        renderLiveFeatures(); 
    }
}

window.shareMedia = function(url) {
    navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
}

// Live Website Render Grid
function renderLiveFeatures() {
    const gridContainer = document.getElementById('live-features-grid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    getMediaData().forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.style = 'background:var(--bg-card-dark); border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.2); display:flex; flex-direction:column; margin-bottom:20px;';
        
        // Media Element Render Check (Image vs Video)
        let mediaHtml = '';
        if(item.type === 'image') {
            mediaHtml = `<div style="height:230px; overflow:hidden;"><img src="${item.url}" style="width:100%; height:100%; object-fit:cover;"></div>`;
        } else {
            mediaHtml = `<div style="height:230px; background:#000;"><video src="${item.url}" controls style="width:100%; height:100%; object-fit:contain;"></video></div>`;
        }

        let commentsHtml = '';
        item.comments.forEach(c => { commentsHtml += `<p style="font-size:0.8rem; margin-bottom:4px;"><strong style="color:#0284c7;">${c.name}:</strong> ${c.text}</p>`; });
        
        wrapper.innerHTML = `
            ${mediaHtml}
            <div style="padding:1rem 1rem 0 1rem;"><h4 style="margin:0; font-size:1rem; color:white;">${item.title}</h4></div>
            <div style="padding:1rem; display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05);">
                <button onclick="likeMedia(${item.id})" style="background:none; border:none; color:#ef4444; font-weight:bold; cursor:pointer;"><i class="fas fa-heart"></i> ${item.likes} Likes</button>
                <button onclick="shareMedia('${item.url}')" style="background:none; border:none; color:#0284c7; font-weight:bold; cursor:pointer;"><i class="fas fa-share-alt"></i> Share</button>
            </div>
            <div style="padding:1rem; background:rgba(0,0,0,0.1); flex-grow:1;">
                <div style="max-height:80px; overflow-y:auto; margin-bottom:10px;">${commentsHtml || '<p style="font-size:0.8rem; color:#64748b;">No comments yet...</p>'}</div>
                <input type="text" id="comment-name-${item.id}" placeholder="Your Name" style="width:100%; margin-bottom:4px; padding:4px; background:var(--bg-dark); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:4px; font-size:0.8rem;">
                <div style="display:flex; gap:5px;"><input type="text" id="comment-text-${item.id}" placeholder="Write a comment..." style="flex-grow:1; padding:4px; background:var(--bg-dark); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:4px; font-size:0.8rem;"><button onclick="addMediaComment(${item.id})" style="background:#0284c7; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-paper-plane"></i></button></div>
            </div>`;
        gridContainer.appendChild(wrapper);
    });
}

function savePointsTable() {
    const teamIndex = document.getElementById('updateTeamSelect').value;
    localStorage.setItem(`team_${teamIndex}_w`, document.getElementById('teamWins').value || "0");
    localStorage.setItem(`team_${teamIndex}_l`, document.getElementById('teamLosses').value || "0");
    localStorage.setItem(`team_${teamIndex}_pts`, document.getElementById('teamPoints').value || "0");
    alert("Points Table Updated!");
}

window.addEventListener('DOMContentLoaded', () => {
    handleLiveWebsiteAudio();
    renderLiveFeatures();
    for (let i = 0; i < 3; i++) {
        const row = document.querySelectorAll('.points-table tbody tr')[i];
        if (row) {
            row.cells[2].innerText = localStorage.getItem(`team_${i}_w`) || "0";
            row.cells[3].innerText = localStorage.getItem(`team_${i}_l`) || "0";
            row.cells[5].innerText = localStorage.getItem(`team_${i}_pts`) || "0";
        }
    }
});
