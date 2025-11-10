document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            id: Date.now() // Create a unique ID using timestamp
        };

        try {
            // Simulate AJAX POST request (in real application, replace with actual API endpoint)
            const response = await simulateAjaxPost(formData);
            
            // Store in local storage
            saveToLocalStorage(formData);
            
            // Clear form
            form.reset();
            
            alert('Registration successful!');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});

// Function to simulate AJAX POST request
function simulateAjaxPost(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // In a real application, replace this with actual API call
            // using fetch() or XMLHttpRequest
            console.log('Data sent to server:', data);
            resolve({ success: true, message: 'Data received successfully' });
        }, 1000);
    });
}

// Function to save data to local storage
function saveToLocalStorage(data) {
    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add new user
    users.push(data);
    
    // Save back to local storage
    localStorage.setItem('users', JSON.stringify(users));
}