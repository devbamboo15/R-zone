export const isInternalEmail = email => {
  /**
   * Check suffix email is @participant.com or @child.com
   */
  const regex = /(\W|^)[\w.+\-]*@(participant|child)\.com(\W|$)/;
  return regex.exec(email) !== null;
};
