export const postData = [];
export const putData = [];

export default function request(body, method) {
  // Signing API request
  if (method == 'POST') {
    postData.push(body);
    return JSON.stringify({
      signedRequest: 'https://signingApi',
      url: 'https://profileUrl'
    });
  }
  // PUT request
  putData.push(body);
  return '';
}
