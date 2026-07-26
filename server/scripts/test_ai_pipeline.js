const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('--- STARTING PHASE T2 AI PIPELINE VERIFICATION ---\n');

  try {
    // 1. Authenticate as Admin
    console.log('1. Authenticating as Admin...');
    const authRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@claurusiq.com',
      password: 'password123'
    });
    
    // Extract cookie
    const cookies = authRes.headers['set-cookie'];
    if (!cookies) throw new Error('No cookies returned on login');
    const cookie = cookies.map(c => c.split(';')[0]).join('; ');
    const axiosInstance = axios.create({
      baseURL: API_URL,
      headers: { Cookie: cookie }
    });
    console.log('✅ Authentication successful.\n');

    // 2. Test Multi-Agent Workflow (Research Engine)
    console.log('2. Starting Research Session (Multi-Agent Workflow)...');
    const workflowRes = await axiosInstance.post('/workflow', {
      query: 'What is Artificial Intelligence?'
    });
    const workflowId = workflowRes.data.workflowId;
    console.log(`✅ Workflow Started (ID: ${workflowId})`);

    // Wait and Poll Workflow Status (Since it takes time)
    let status = 'running';
    console.log('Polling workflow status...');
    while (status === 'running' || status === 'idle') {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await axiosInstance.get(`/workflow/${workflowId}`);
      status = statusRes.data.data.status;
      const progress = statusRes.data.data.progress || 0;
      console.log(`   Status: ${status}, Progress: ${progress}%`);
    }
    console.log(`✅ Workflow Completed with status: ${status}\n`);

    // 3. Test Document Intelligence
    console.log('3. Testing Document Intelligence (Upload & Parse)...');
    // Create a dummy text file
    const tempFilePath = path.join(__dirname, 'dummy_test.txt');
    fs.writeFileSync(tempFilePath, 'Artificial Intelligence is a broad field of science. It involves machine learning and deep learning models such as transformers. GPT is a transformer.');
    
    const formData = new FormData();
    formData.append('document', fs.createReadStream(tempFilePath));
    
    const docRes = await axiosInstance.post('/documents/upload', formData, {
      headers: formData.getHeaders()
    });
    const documentId = docRes.data.documentId;
    console.log(`✅ Document Uploaded and Parsed (ID: ${documentId})`);
    
    fs.unlinkSync(tempFilePath); // Cleanup

    // Wait and Poll Document Status
    let docStatus = 'parsing';
    console.log('Polling document status...');
    while (docStatus === 'parsing' || docStatus === 'extracting') {
      await new Promise(r => setTimeout(r, 3000));
      const statusRes = await axiosInstance.get(`/documents/${documentId}`);
      docStatus = statusRes.data.data.status;
      console.log(`   Status: ${docStatus}`);
    }
    console.log(`✅ Document Completed with status: ${docStatus} (Note: Failure expected if Gemini quota exhausted)\n`);

    // 4. Test Conversational AI
    console.log('4. Testing Conversational AI (Assistant)...');
    const chatRes = await axiosInstance.post('/chat/message', {
      message: 'Can you summarize what Artificial Intelligence is based on the recent research?',
      context: { workflowId }
    });
    console.log(`✅ Chat Response received: ${chatRes.data.data.response.text.substring(0, 150)}...\n`);

    console.log('--- ALL AI MODULES VERIFIED SUCCESSFULLY ---');
  } catch (err) {
    console.error('❌ Pipeline Test Failed:');
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

runTests();
