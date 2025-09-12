import type { Node, NodeProps } from 'reactflow';
import { Buffer } from 'buffer';
import * as CryptoJS from 'crypto-js';

// --- Component Imports ---
import { TextInputNode } from '@/components/nodes/TextInputNode';
import { TextDisplayNode } from '@/components/nodes/TextDisplayNode';
import { Base64Node } from '@/components/nodes/Base64Node';
import { HashNode } from '@/components/nodes/HashNode';
import { JsonNode } from '@/components/nodes/JsonNode';
import { RegexNode } from '@/components/nodes/RegexNode';
import { CryptoNode } from '@/components/nodes/CryptoNode';

// --- Type Definitions ---

export type Processor = (inputs: unknown[], internalState: Record<string, unknown>) => unknown[];
export type Port = { id: string; name: string; };

export interface CustomNodeData {
  definition: NodeDefinition;
  outputValues: Record<string, unknown>;
  internalState: Record<string, unknown>;
  hasError?: boolean;
}

export type CustomNode = Node<CustomNodeData>;

export interface NodeDefinition {
  type: string;
  name: string;
  inputs: Port[];
  outputs: Port[];
  processor: Processor;
  initialState?: Record<string, unknown>;
  component: React.ComponentType<NodeProps<CustomNodeData>>;
}

// --- Processor Implementations ---

const textInputProcessor: Processor = (_inputs, state) => [state.text];
const textDisplayProcessor: Processor = (_inputs, _state) => [];

const base64Processor: Processor = (inputs, state) => {
  const input = inputs[0] || '';
  const mode = state.mode || 'encode';
  try {
    if (mode === 'encode') return [Buffer.from(input as string, 'utf8').toString('base64')];
    else return [Buffer.from(input as string, 'base64').toString('utf8')];
  } catch (e) {
    console.error('Base64 error:', e);
    throw new Error('Invalid Input for Base64');
  }
};

const hashProcessor: Processor = (inputs, state) => {
  const input = String(inputs[0] || '');
  const algorithm = state.algorithm as string || 'SHA256';
  try {
    const hasher = (CryptoJS as any)[algorithm];
    if (!hasher) throw new Error(`Algorithm ${algorithm} not found`);
    return [hasher(input).toString()];
  } catch (e) {
    console.error('Hashing error:', e);
    throw e;
  }
};

const jsonProcessor: Processor = (inputs, state) => {
  const input = String(inputs[0] || '');
  const mode = state.mode || 'format';
  try {
    switch (mode) {
      case 'format':
        return [JSON.stringify(JSON.parse(input), null, 2)];
      case 'compress':
        return [JSON.stringify(JSON.parse(input))];
      case 'escape':
        return [JSON.stringify(input)];
      case 'unescape':
        return [JSON.parse(input)];
      default:
        throw new Error(`Unknown JSON mode: ${mode}`);
    }
  } catch (e) {
    console.error('JSON error:', e);
    throw new Error('Invalid JSON Input');
  }
};

const regexProcessor: Processor = (inputs, state) => {
  const input = String(inputs[0] || '');
  const pattern = state.pattern as string || '';
  const flags = state.flags as string || '';
  try {
    const regex = new RegExp(pattern, flags);
    const matches = input.match(regex);
    return [matches ? matches.join('\n') : 'No matches'];
  } catch (e) {
    console.error('Regex error:', e);
    throw new Error('Invalid Regex Pattern');
  }
};

const cryptoProcessor: Processor = (inputs, state) => {
  const input = String(inputs[0] || '');
  const key = state.key as string || '';
  const mode = state.mode || 'encrypt';
  try {
    if (!key) throw new Error('Secret Key is required');
    if (mode === 'encrypt') {
      return [CryptoJS.AES.encrypt(input, key).toString()];
    } else {
      const bytes = CryptoJS.AES.decrypt(input, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) throw new Error('Decryption failed (wrong key?)');
      return [originalText];
    }
  } catch (e) {
    console.error('Crypto error:', e);
    throw e;
  }
};

// --- Node Definitions Dictionary ---

export const nodeDefinitions: Record<string, NodeDefinition> = {
  textInput: {
    type: 'textInput',
    name: 'Text Input',
    inputs: [],
    outputs: [{ id: 'text', name: 'Text' }],
    processor: textInputProcessor,
    initialState: { text: 'Hello World' },
    component: TextInputNode,
  },
  textDisplay: {
    type: 'textDisplay',
    name: 'Text Display',
    inputs: [{ id: 'text', name: 'Text' }],
    outputs: [],
    processor: textDisplayProcessor,
    component: TextDisplayNode,
  },
  base64: {
    type: 'base64',
    name: 'Base64',
    inputs: [{ id: 'input', name: 'Input' }],
    outputs: [{ id: 'output', name: 'Output' }],
    processor: base64Processor,
    initialState: { mode: 'encode' },
    component: Base64Node,
  },
  hash: {
    type: 'hash',
    name: 'Hash',
    inputs: [{ id: 'input', name: 'Input' }],
    outputs: [{ id: 'output', name: 'Output' }],
    processor: hashProcessor,
    initialState: { algorithm: 'SHA256' },
    component: HashNode,
  },
  json: {
    type: 'json',
    name: 'JSON',
    inputs: [{ id: 'input', name: 'Input' }],
    outputs: [{ id: 'output', name: 'Output' }],
    processor: jsonProcessor,
    initialState: { mode: 'format' },
    component: JsonNode,
  },
  regex: {
    type: 'regex',
    name: 'Regex Match',
    inputs: [{ id: 'input', name: 'Input' }],
    outputs: [{ id: 'output', name: 'Output' }],
    processor: regexProcessor,
    initialState: { pattern: '(Hello)', flags: 'gi' },
    component: RegexNode,
  },
  crypto: {
    type: 'crypto',
    name: 'Encrypt / Decrypt',
    inputs: [{ id: 'input', name: 'Input' }],
    outputs: [{ id: 'output', name: 'Output' }],
    processor: cryptoProcessor,
    initialState: { mode: 'encrypt', key: '' },
    component: CryptoNode,
  },
};
