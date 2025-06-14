export interface TypeConfig {
  id: string;
  label: string;
  value: string;
  fields: InputField[];
  api: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    payloadType: string;
    responsePath: string;
    responseExample?: string;
    mainPayloadField: string;
    mainPayloadFieldType: 'string' | 'array' | 'int' | 'boolean' | 'file';
    payloadFields: PayloadField[];
    payload: (formData: Record<string, any>) => any;
  };
}

export interface InputField {
  id: string;
  label: string;
  type: 'text' | 'file' | 'number';
  required: boolean;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
}

export interface PayloadField {
  name: string;
  type: 'string' | 'array' | 'int' | 'float' | 'boolean' | 'file';
  sourceType: 'input' | 'static';
  source: string;
}

export const typeConfigs: TypeConfig[] = [
  {
    id: '1001',
    label: 'Document Processing',
    value: 'document',
    fields: [
      {
        id: 'knowledgeBase',
        label: 'Knowledge Base Files',
        type: 'file',
        required: true,
        accept: '.txt',
        multiple: true
      },
      {
        id: 'schemaTool',
        label: 'Schema Tool Files',
        type: 'file',
        required: true,
        accept: '.txt',
        multiple: true
      }
    ],
    api: {
      endpoint: '/api/process/document',
      method: 'POST',
      payloadType: 'json',
      responsePath: '/api/process/document',
      responseExample: 'Example response path',
      mainPayloadField: 'document',
      mainPayloadFieldType: 'string',
      payloadFields: [
        { name: 'knowledgeBase', type: 'file', sourceType: 'input', source: 'knowledgeBase' },
        { name: 'schemaTool', type: 'file', sourceType: 'input', source: 'schemaTool' }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['document'] = '';
        payload['knowledgeBase'] = formData.knowledgeBase || [];
        payload['schemaTool'] = formData.schemaTool || [];
        return payload;
      }
    }
  },
  {
    id: '1002',
    label: 'Summary Generation',
    value: 'summary',
    fields: [
      {
        id: 'summaryLength',
        label: 'Summary Length',
        type: 'number',
        required: true,
        placeholder: 'Enter summary length'
      },
      {
        id: 'contentFile',
        label: 'Content File',
        type: 'file',
        required: true,
        accept: '.txt,.doc,.docx',
        multiple: false
      }
    ],
    api: {
      endpoint: '/api/process/summary',
      method: 'POST',
      payloadType: 'json',
      responsePath: '/api/process/summary',
      responseExample: 'Example response path',
      mainPayloadField: 'summary',
      mainPayloadFieldType: 'string',
      payloadFields: [
        { name: 'summaryLength', type: 'int', sourceType: 'input', source: 'summaryLength' },
        { name: 'contentFile', type: 'file', sourceType: 'input', source: 'contentFile' }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['summary'] = '';
        payload['summaryLength'] = parseInt(formData.summaryLength);
        payload['contentFile'] = formData.contentFile;
        return payload;
      }
    }
  },
  {
    id: '1003',
    label: 'Content Analysis',
    value: 'analysis',
    fields: [
      {
        id: 'analysisType',
        label: 'Analysis Type',
        type: 'text',
        required: true,
        placeholder: 'Enter analysis type'
      },
      {
        id: 'dataFile',
        label: 'Data File',
        type: 'file',
        required: true,
        accept: '.csv,.json',
        multiple: false
      }
    ],
    api: {
      endpoint: '/api/process/analysis',
      method: 'POST',
      payloadType: 'json',
      responsePath: '/api/process/analysis',
      responseExample: 'Example response path',
      mainPayloadField: 'analysis',
      mainPayloadFieldType: 'string',
      payloadFields: [
        { name: 'analysisType', type: 'string', sourceType: 'input', source: 'analysisType' },
        { name: 'dataFile', type: 'file', sourceType: 'input', source: 'dataFile' }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['analysis'] = '';
        payload['analysisType'] = formData.analysisType;
        payload['dataFile'] = formData.dataFile;
        return payload;
      }
    }
  },
  {
    id: '8379',
    label: 'pexel video',
    value: 'pexel video',
    fields: [],
    api: {
      endpoint: 'https://dev.felidae.network/api/pexels/videos/search',
      method: 'GET',
      payloadType: 'json',
      responsePath: 'videos',
      responseExample: '{\n  "url": "https://api-server.pexels.com/search/videos/dog/",\n  "videos": [\n    {\n      "id": 3191251,\n      "width": 4096,\n      "height": 2160,\n      "url": "https://www.pexels.com/video/boy-playing-with-his-dog-3191251/",\n      "type": null,\n      "image": "https://images.pexels.com/videos/3191251/free-video-3191251.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",\n      "duration": 13,\n      "user": {\n        "id": 1583460,\n        "name": "Pressmaster",\n        "url": "https://www.pexels.com/@pressmaster"\n      },',
      mainPayloadField: 'query',
      mainPayloadFieldType: 'string',
      payloadFields: [
        {
          "type": "string",
          "sourceType": "static",
          "name": "orientation",
          "source": "landscape"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "size",
          "source": "medium"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "locale",
          "source": "en-US"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "page",
          "source": "1"
        }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['query'] = '';
        payload['orientation'] = 'landscape';
        payload['size'] = 'medium';
        payload['locale'] = 'en-US';
        payload['page'] = '1';
        return payload;
      }
    }
  },
  {
    id: '3433',
    label: 'pexel image 22',
    value: 'pexel image 22',
    fields: [],
    api: {
      endpoint: 'https://dev.felidae.network/api/pexels/videos/search',
      method: 'GET',
      payloadType: 'json',
      responsePath: 'videos.video_files',
      responseExample: '{\n  "url": "https://api-server.pexels.com/search/videos/dog/",\n  "videos": [\n    {\n      "id": 3191251,\n      "width": 4096,\n      "height": 2160,\n      "url": "https://www.pexels.com/video/boy-playing-with-his-dog-3191251/",\n      "type": null,\n      "image": "https://images.pexels.com/videos/3191251/free-video-3191251.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",\n      "duration": 13,\n      "user": {\n        "id": 1583460,\n        "name": "Pressmaster",\n        "url": "https://www.pexels.com/@pressmaster"\n      },\n      "video_files": [\n        {\n          "id": 9292384,\n          "quality": "hd",\n          "file_type": "video/mp4",\n          "width": 1366,\n          "height": 720,\n          "link": "https://videos.pexels.com/video-files/3191251/3191251-hd_1366_720_25fps.mp4",\n          "fps": 25,\n          "size": 4092157\n        },',
      mainPayloadField: 'query',
      mainPayloadFieldType: 'string',
      payloadFields: [
        {
          "type": "string",
          "sourceType": "static",
          "name": "orientation",
          "source": "landscape"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "size",
          "source": "medium"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "locale",
          "source": "en-US"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "page",
          "source": "1"
        },
        {
          "type": "string",
          "sourceType": "static",
          "name": "per_page",
          "source": "10"
        }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['query'] = '';
        payload['orientation'] = 'landscape';
        payload['size'] = 'medium';
        payload['locale'] = 'en-US';
        payload['page'] = '1';
        payload['per_page'] = '10';
        return payload;
      }
    }
  }
,
  {
    id: '3748',
    label: 'CodeGPT',
    value: 'CodeGPT',
    fields: [
  {
    "id": "1",
    "label": "attachments",
    "type": "file",
    "required": true
  }
],

    api: {
      endpoint: 'https://dev.felidae.network/api/chatgpt/code_generation',
      method: 'POST',
      payloadType: 'multipart',
      responsePath: 'data.data.code',
      responseExample: '{\n  "message": "Code generation successful.",\n  "data": {\n    "status": true,\n    "data": {\n      "code": "```python\ndef factorial(n):\n    if n < 0:\n        raise ValueError(\"Factorial is not defined for negative numbers.\")\n    elif n == 0 or n == 1:\n        return 1\n    else:\n        result = 1\n        for i in range(2, n + 1):\n            result *= i\n        return result\n```"\n    },\n    "timestamp": "2025-06-14T12:16:12+00:00"\n  }\n}',
      mainPayloadField: 'description',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": " model",
    "source": "gpt-4o-mini"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "string",
    "sourceType": "input",
    "name": "attachments",
    "source": "1"
  }
],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['description'] = '';
        payload[' model'] = 'gpt-4o-mini';
        payload['temperature'] = '0.7';
        payload['max_tokens'] = '200';
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
,
  {
    id: '3303',
    label: 'GPTCode2',
    value: 'GPTCode2',
    fields: [
  {
    "id": "1",
    "label": "attachment",
    "type": "file",
    "required": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/chatgpt/code_generation',
      method: 'POST',
      payloadType: 'multipart',
      responsePath: 'data.data.code',
      responseExample: '{\n  "message": "Code generation successful.",\n  "data": {\n    "status": true,\n    "data": {\n      "code": "```python\ndef factorial(n):\n    if n < 0:\n        raise ValueError(\"Factorial is not defined for negative numbers.\")\n    elif n == 0 or n == 1:\n        return 1\n    else:\n        result = 1\n        for i in range(2, n + 1):\n            result *= i\n        return result\n```"\n    },\n    "timestamp": "2025-06-14T12:16:12+00:00"\n  }\n}',
      mainPayloadField: 'description',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": "model",
    "source": "gpt-4o-mini"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "array",
    "sourceType": "input",
    "name": "attachments",
    "source": "1"
  }
],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['description'] = '';
        payload['model'] = 'gpt-4o-mini';
        payload['temperature'] = '0.7';
        payload['max_tokens'] = '200';
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
,
  {
    id: '8712',
    label: 'chatCompletetion',
    value: 'chatCompletetion',
    fields: [
  {
    "id": "1",
    "label": "knowledge_base",
    "type": "file",
    "required": true
  },
  {
    "id": "2",
    "label": "schema_tool",
    "type": "file",
    "required": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/chatgpt/chat_completion',
      method: 'POST',
      payloadType: 'multipart',
      responsePath: 'data.choices.message.content',
      responseExample: '{\n  "message": "Chat completion successful.",\n  "data": {\n    "id": "chatcmpl-BiKij1RwklL6cFbc1Nhj7mCCf3MGa",\n    "object": "chat.completion",\n    "created": 1749905781,\n    "model": "gpt-4-0613",\n    "systemFingerprint": null,\n    "choices": [\n      {\n        "index": 0,\n        "message": {\n          "role": "assistant",\n          "content": "Sure, I can help with that, but I need more information about the content you need. What are the topics? Are they blog posts, reports, academic articles, fictional stories, etc? Please provide as much detail as possible.",\n          "toolCalls": [],\n          "functionCall": null\n        },\n        "finishReason": "stop"\n      }\n    ],\n    "usage": {\n      "promptTokens": 16,\n      "completionTokens": 47,\n      "totalTokens": 63,\n      "promptTokensDetails": {\n        "audioTokens": 0,\n        "cachedTokens": 0',
      mainPayloadField: 'messages',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": "model",
    "source": "gpt-4"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "array",
    "sourceType": "input",
    "name": "knowledge_base",
    "source": "1"
  },
  {
    "type": "array",
    "sourceType": "input",
    "name": "schema_tool",
    "source": "2"
  }
],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['messages'] = '';
        payload['model'] = 'gpt-4';
        payload['temperature'] = '0.7';
        payload['max_tokens'] = '200';
        payload['knowledge_base'] = formData['1'];
        payload['schema_tool'] = formData['2'];
        return payload;
      }
    }
  }
];
