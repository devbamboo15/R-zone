export const copy = value => {
  // Create a dummy input to copy the string array inside it
  const dummy = document.createElement('input');

  // Add it to the document
  document.body.appendChild(dummy);

  // Set its ID
  dummy.setAttribute('id', 'dummy_id');

  // Output the array into it
  const dummyElment: any = document.getElementById('dummy_id');
  dummyElment.value = value;

  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand('copy');

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);
};
