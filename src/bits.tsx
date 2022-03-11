import React from 'react';

export function Missing({ name }: { name: string | number | symbol }) {
  return (
    <>
      {process.env.NODE_ENV == 'development' && (
        <span>
          could not create form element for name:{name} (are your "validators"
          missing keys that are defined in "translations")
        </span>
      )}
    </>
  );
}
