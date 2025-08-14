import React from "react";
import { Container } from "@/components/core";

const NotFoundPage = () => {
  return (
    <Container>
      <section className="bg-white">
        <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black">
          <h1 className="mt-8 text-4xl md:text-6xl">Page Not Found</h1>
          {/* <Link className='mt-8 md:text-lg text-indigo-600 hover:underline' href='/'>
            Back to Home
          </Link> */}
        </div>
      </section>
    </Container>
  );
};

export default NotFoundPage;
