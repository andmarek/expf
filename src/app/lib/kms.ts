import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";

export async function decryptData(ciphertextBlob: string, keyId: string) {
  const client = new KMSClient({ region: "us-east-1" });


  const command = new DecryptCommand({
    KeyId: keyId,
    CiphertextBlob: Buffer.from(ciphertextBlob, 'base64'),
  });
  const kmsResponse = await client.send(command);
  const decryptedData = new TextDecoder().decode(kmsResponse.Plaintext);
  return decryptedData;
}
