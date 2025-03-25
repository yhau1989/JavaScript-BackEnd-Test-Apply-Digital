import * as dotenv from 'dotenv';
import { ContenfullContentType } from 'src/types/general-types';
dotenv.config();

const COTENFULL_API_URL = process.env.COTENFULL_API_URL ?? 'https://cdn.contentful.com/';
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT;

export const contenfullUrlByContentType = (contentType: ContenfullContentType) => {
  const response = `${COTENFULL_API_URL}spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=${contentType}`;
  return response;
};
