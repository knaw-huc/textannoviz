import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Base64} from "js-base64";
import {SearchQuery} from "../../model/Search.ts";

type SearchParams = {
  text: string;
};

async function search(searchParams: any): Promise<any> {
  return Promise.resolve(searchParams);
}

export default function SearchTest() {
  const [urlParams, setUrlParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchParams>();
  const [fullText, setFullText] = useState("");

  // Initialize searchParams once:
  useEffect(() => {
    const queryDecoded = getUrlParams(urlParams);
    if (!searchParams && queryDecoded?.text) {
      const fromUrl = {
        text: queryDecoded.text || ''
      };
      setSearchParams(fromUrl);
    }
  }, [searchParams, urlParams, setSearchParams]);

  // Keep url in sync with searchParams:
  useEffect(() => {
    if(!searchParams) {
      return;
    }
    setUrlParams(createUrlParams(searchParams, urlParams));
  }, [searchParams, setUrlParams]);

  // Run search query when search params change:
  useEffect(() => {
    search(searchParams).then(() =>
        setFullText('Lorem Ipsum')
    );
  }, [searchParams, setFullText]);

  if (!searchParams) {
    return null;
  }

  return <>
    <input
        value={searchParams.text}
        onChange={e => {
          setSearchParams({
            text: e.currentTarget.value
          })
        }}
    />
    {fullText}
  </>

}

function getUrlParams(urlParams: URLSearchParams): SearchQuery {
  const queryEncoded = urlParams.get("query");
  return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
}

function createUrlParams(searchParams: SearchParams, urlParams: URLSearchParams): URLSearchParams {
  const newUrlParams = structuredClone(urlParams);
  const queryEncoded = Base64.toBase64(JSON.stringify(searchParams));
  newUrlParams.set("query", queryEncoded);
  return newUrlParams;
}
