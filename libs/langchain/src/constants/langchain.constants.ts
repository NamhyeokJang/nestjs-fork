/**
 * Queue name
 */
export const LANGCHAIN_QUEUE = {
  EMBEDDING: 'langchain-embedding-file',
  REMOVE_EMBEDDED: 'langchain-remove-embedded',
}

// langchain vector table 제한 (10글자 이내, 숫자, 소문자만 허용)
export const VECTOR_STORE_REG = /^[a-z0-9]{1,10}$/
