import { test } from 'node:test';
import * as assert from 'node:assert';
import AoLoader from '@permaweb/ao-loader';
import fs from 'fs';

const wasm = fs.readFileSync('./process.wasm');

test('run issac cipher successfully', async () => {
	const handle = await AoLoader(wasm);
	const env = {
		Process: {
			Id: 'AOS',
			Owner: 'FOOBAR',
			Tags: [{ name: 'Name', value: 'Thomas' }],
		},
	};

	const results = [ "412C3D76522622667D7836", "hello world" ]

	
	const data = `
		local crypto = require(".crypto");

		local results = {};

		local message = "hello world";
		local key = "secret-key";

		local encrypted, decrypted;

		encrypted = crypto.cipher.issac.encrypt(message, key);
		decrypted = crypto.cipher.issac.decrypt(encrypted, key);

		results[1] = crypto.utils.hex.ascii2hex(encrypted);
		results[2] = decrypted;

		return table.concat(results, ", ");
	`;
	const msg = {
		Target: 'AOS',
		Owner: 'FOOBAR',
		['Block-Height']: '1000',
		Id: '1234xyxfoo',
		Module: 'WOOPAWOOPA',
		Tags: [{ name: 'Action', value: 'Eval' }],
		Data: data,
	};

	const result = await handle(null, msg, env);
	assert.equal(result.Output?.data.output, results.join(', '));
	assert.ok(true);
});
