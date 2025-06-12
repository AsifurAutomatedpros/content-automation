export interface TypeConfig {
  id: string;
  label: string;
  value: string;
  fields: InputField[];
  api: {
    endpoint: string;
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
  type: 'string' | 'array' | 'int' | 'boolean' | 'file';
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
  
   { id: '1940',
    label: 'GPT Code',
    value: 'code',
    fields: [
      {
        id: 'description',
        label: 'Code Description',
        type: 'text',
        required: true,
        placeholder: 'Enter code description'
      },
      {
        id: 'attachment',
        label: 'Attachment',
        type: 'file',
        required: true,
        accept: '.txt,.js,.ts,.jsx,.tsx',
        multiple: false
      }
    ],
    api: {
      endpoint: '/api/process/code',
      payloadType: 'multipart',
      responsePath: 'data.data.code',
      responseExample: '{"message": "Code generation successful.", "data": {"status": true, "data": {"code": "example code"}, "timestamp": "2025-06-11T10:46:10+00:00"}}',
      mainPayloadField: 'description',
      mainPayloadFieldType: 'string',
      payloadFields: [
        { name: 'description', type: 'string', sourceType: 'input', source: 'description' },
        { name: 'attachment', type: 'file', sourceType: 'input', source: 'attachment' }
      ],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['description'] = '';
        payload['attachment'] = formData.attachment;
        return payload;
      }
    }
  },
  {
    id: '7618',
    label: 'newset gpt22222',
    value: 'newset gpt22222',
    fields: [
  {
    "id": "1",
    "label": "attachments",
    "type": "file",
    "required": true,
    "multiple": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/chatgpt/code_generation',
      payloadType: 'multipart',
      responsePath: 'data.data.code',
      responseExample: '{\n  "message": "Code generation successful.",\n  "data": {\n    "status": true,\n    "data": {\n      "code": "```tsx\n\"use client\";\n\nimport React, { useState } from \"react\";\nimport { cn } from \"@/lib/utils\";\nimport { Avatar } from \"./ui/avatar\";\nimport Icon from \"./icon/Icon\";\nimport { typography } from \"@/app/styles/typography\";\nimport SimpleButton from \"./ui/simple-button\";\nimport { IconicButton } from \"./IconicButton\";\nimport { EditNameModal } from \"./EditNameModal\";\nimport { ChangePasswordModal } from \"./ChangePasswordModal\";\nimport { VerifyPhoneNumberModal } from \"./VerifyPhoneNumberModal\";\nimport { useRouter } from \"next/navigation\";\nimport { Modal } from \"./ui/modal\";\nimport { Button } from \"./ui/button\";\nimport { PhoneNumberInput } from \"./PhoneNumberInput\";\nimport { countries } from \'./ui/CountryList\';\n\nexport interface ProfileProps {\n  name: string;\n  email: string;\n  phone: string;\n  profileImage?: string;\n  showAvatarEdit?: boolean;\n  password:"\n    },\n    "timestamp": "2025-06-11T10:46:10+00:00"\n  }\n}',
      mainPayloadField: 'description',
      mainPayloadFieldType: 'string',
      payloadFields: [
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
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
,
  {
    id: '7155',
    label: 'gpt example',
    value: 'gpt example',
    fields: [
  {
    "id": "1",
    "label": "attachments",
    "type": "file",
    "required": true,
    "multiple": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/chatgpt/code_generation',
      payloadType: 'multipart',
      responsePath: 'data.data.code',
      responseExample: '{\n  "message": "Code generation successful.",\n  "data": {\n    "status": true,\n    "data": {\n      "code": "```tsx\n\"use client\";\n\nimport React, { useState } from \"react\";\nimport { cn } from \"@/lib/utils\";\nimport { Avatar } from \"./ui/avatar\";\nimport Icon from \"./icon/Icon\";\nimport { typography } from \"@/app/styles/typography\";\nimport SimpleButton from \"./ui/simple-button\";\nimport { IconicButton } from \"./IconicButton\";\nimport { EditNameModal } from \"./EditNameModal\";\nimport { ChangePasswordModal } from \"./ChangePasswordModal\";\nimport { VerifyPhoneNumberModal } from \"./VerifyPhoneNumberModal\";\nimport { useRouter } from \"next/navigation\";\nimport { Modal } from \"./ui/modal\";\nimport { Button } from \"./ui/button\";\nimport { PhoneNumberInput } from \"./PhoneNumberInput\";\nimport { countries } from \'./ui/CountryList\';\n\nexport interface ProfileProps {\n  name: string;\n  email: string;\n  phone: string;\n  profileImage?: string;\n  showAvatarEdit?: boolean;\n  password:"\n    },\n    "timestamp": "2025-06-11T10:46:10+00:00"\n  }\n}',
      mainPayloadField: 'description',
      mainPayloadFieldType: 'array',
      payloadFields: [
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
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
];
