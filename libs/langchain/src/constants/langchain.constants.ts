/**
 * Queue name
 */
export const LANGCHAIN_QUEUE = {
  EMBEDDING: 'langchain-embedding-file',
  REMOVE_EMBEDDED: 'langchain-remove-embedded',
}

// langchain vector table 제한 (20글자 이내, 숫자, 소문자만 허용)
export const LANGCHAIN_PROJECT_REG = /^[a-z0-9]{1,20}$/
