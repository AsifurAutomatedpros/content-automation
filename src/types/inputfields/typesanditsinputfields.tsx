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
,
  {
    id: '6613',
    label: 'gemini',
    value: 'gemini',
    fields: [],
    api: {
      endpoint: 'https://dev.felidae.network/api/gemini/text_generation',
      payloadType: 'json',
      responsePath: 'generated_text',
      responseExample: '{\n  "generated_text": "Sir Gideon, the last of the Gryphon Knights, squinted at the plume of smoke rising from Oakhaven. His armor, once gleaming silver, was now dull with the dust of a hundred leagues. He\'d been chasing the beast for weeks, ever since it descended upon the valley, scorching fields and demanding tribute.  His horse, Valiant, snorted nervously, sensing the menace ahead.\n\nOakhaven was a charnel house. Homes were reduced to smoldering timbers.  A single terrified villager cowered behind a well, pointing a trembling finger towards a jagged peak overlooking the village.  Perched atop it, a magnificent yet terrible creature basked in the afternoon sun. Its scales shimmered like a thousand emeralds, and smoke curled from its nostrils.  The dragon.\n\nFear coiled in Gideon\'s gut, but duty quelled it. He dismounted, the clang of his armor ringing in the unnatural silence.  \"Where are the others?\" he asked the villager, his voice rough.\n\n\"Taken!\" the man croaked. \"Into the cave! The dragon... it takes the strongest... as... as sacrifices!\"\n\nGideon\'s jaw tightened. He knew what he had to do.  He drew his sword, Dawnbringer, its blade whispering with ancient magic. \"Show me the cave,\" he commanded.\n\nThe cave mouth gaped like a maw, reeking of sulphur and fear. Gideon, ignoring the tremors that shook the ground, strode in. The air grew hot and thick. The dragon\'s hoard, a glittering mountain of gold and jewels, lay scattered across the cave floor.  And chained to the far wall, he saw them – the villagers, their faces pale with terror.\n\nThe dragon uncoiled itself, its eyes burning like embers.  \"Another morsel?\" it boomed, its voice a rumble of thunder. \"You knights are so predictable.  Bravery is such a tedious appetizer.\"\n\n\"They are not your food!\" Gideon roared, his voice echoing in the cavern.  He charged, Dawnbringer flashing.\n\nThe dragon lunged, its claws raking the air. Gideon rolled beneath the attack, feeling the heat of its breath scorch his back.  He slashed at the dragon\'s flank, drawing a hiss of pain and a spray of emerald blood.  Enraged, the dragon unleashed a torrent of flame, but Gideon, anticipating the attack, had already taken cover behind a fallen stalactite.\n\nThe battle raged.  Gideon, smaller and quicker, dodged and weaved, landing blow after blow. The dragon, though powerful, was hampered by the confines of the cave.  Finally, seeing an opening, Gideon darted forward and plunged Dawnbringer deep into the dragon\'s underbelly.\n\nA roar of agony echoed through the cave as the dragon thrashed, its movements growing weaker. With a final shudder, it collapsed, its emerald scales dulling as life ebbed away.\n\nSilence descended upon the cave, broken only by the whimpers of the freed villagers.  Gideon, leaning heavily on Dawnbringer, watched as they rushed to embrace their families.  He had saved them.  He had slain the dragon.  He was, after all, a Gryphon Knight.  And bravery, he thought, was sometimes its own reward.\n"\n}',
      mainPayloadField: 'prompt',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": "model",
    "source": "gemini-1.5-pro"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
  }
],
      payload: (formData: Record<string, any>) => {
        const payload: Record<string, any> = {};
        payload['prompt'] = '';
        payload['model'] = 'gemini-1.5-pro';
        payload['max_tokens'] = '200';
        payload['temperature'] = '0.7';
        return payload;
      }
    }
  }
,
  {
    id: '9096',
    label: 'final code',
    value: 'final code',
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
      responseExample: '{\n  "message": "Code generation successful.",\n  "data": {\n    "status": true,\n    "data": {\n      "code": "```python\ndef factorial(n: int) -> int:\n    if n < 0:\n        raise ValueError(\"Factorial is not defined for negative numbers.\")\n    if n == 0 or n == 1:\n        return 1\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n```"\n    },\n    "timestamp": "2025-06-13T06:49:54+00:00"\n  }\n}',
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
    "type": "int",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
  },
  {
    "type": "int",
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
    id: '7303',
    label: 'fresh code',
    value: 'fresh code',
    fields: [
  {
    "id": "attachmentss",
    "label": "1",
    "type": "file",
    "required": true,
    "multiple": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/gemini/code_generation',
      payloadType: 'multipart',
      responsePath: 'data.code',
      responseExample: '{\n  "status": true,\n  "data": {\n    "code": "```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Simple HTML</title>\n</head>\n<body>\n    <div>\n        <h1>Hello, World!</h1>\n        <p>This is a simple HTML example.</p>\n    </div>\n</body>\n</html>\n```"\n  },\n  "timestamp": "2025-06-13T08:42:18+00:00"\n}',
      mainPayloadField: 'prompt',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": "model",
    "source": "gemini-1.5-pro"
  },
  {
    "type": "int",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "float",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
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
        payload['prompt'] = '';
        payload['model'] = 'gemini-1.5-pro';
        payload['max_tokens'] = 200;
        payload['temperature'] = 0.7;
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
,
  {
    id: '2145',
    label: 'newest',
    value: 'newest',
    fields: [
  {
    "id": "1",
    "label": "attachmentss",
    "type": "file",
    "required": true,
    "multiple": true
  }
],
    api: {
      endpoint: 'https://dev.felidae.network/api/gemini/code_generation',
      payloadType: 'multipart',
      responsePath: 'data.code',
      responseExample: '{\n  "status": true,\n  "data": {\n    "code": "```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Simple HTML</title>\n</head>\n<body>\n    <div>\n        <h1>Hello, World!</h1>\n        <p>This is a simple HTML example.</p>\n    </div>\n</body>\n</html>\n```"\n  },\n  "timestamp": "2025-06-13T08:42:18+00:00"\n}',
      mainPayloadField: 'prompt',
      mainPayloadFieldType: 'string',
      payloadFields: [
  {
    "type": "string",
    "sourceType": "static",
    "name": " model",
    "source": "gemini-1.5-pro"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "max_tokens",
    "source": "200"
  },
  {
    "type": "string",
    "sourceType": "static",
    "name": "temperature",
    "source": "0.7"
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
        payload['prompt'] = '';
        payload[' model'] = 'gemini-1.5-pro';
        payload['max_tokens'] = '200';
        payload['temperature'] = '0.7';
        payload['attachments'] = formData['1'];
        return payload;
      }
    }
  }
];
