import React, { useState } from "react";
import axios from "axios";

interface Book {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  averageRating?: number;
  image?: string;
  language: string;
  isbn: string;
  firstDonator: string;
  currentOwner: string;
}

const AISearchBookForm = () => {
  return <div></div>;
};

export default AISearchBookForm;
