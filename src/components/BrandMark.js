import React from 'react';
import { Link } from 'react-router-dom';
import './BrandMark.css';

const BrandMark = ({ linked = true, size = 'md' }) => {
  const content = (
    <>
      <span className="brand-mark__icon" aria-hidden="true">
        <span className="brand-mark__pulse" />
      </span>
      <span className="brand-mark__text">Panic Pin</span>
    </>
  );

  if (linked) {
    return (
      <Link to="/" className={`brand-mark brand-mark--${size}`}>
        {content}
      </Link>
    );
  }

  return <div className={`brand-mark brand-mark--${size}`}>{content}</div>;
};

export default BrandMark;
