import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private renderer: Renderer2;
  constructor(private meta: Meta, private title: Title,rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Set title and meta tags dynamically
  updateMetaTags(config: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }) {
    // Set page title
    this.title.setTitle(config.title);

    // Update meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Update Open Graph (Facebook) tags
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({ property: 'og:image', content: config.image || '' });
    this.meta.updateTag({
      property: 'og:url',
      content: config.url || window.location.href,
    });

    // Update Twitter Card tags
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: config.image || '' });
  }

  // Method to remove meta tags if necessary
  removeMetaTags() {
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
  }

  // Method to inject structured data (JSON-LD) into the page
  setStructuredData(blog: { title: string; description: string; author: string; date: string; image: string; url: string }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.description,
      author: {
        '@type': 'Person',
        name: blog.author
      },
      datePublished: blog.date,
      image: blog.image,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': blog.url
      }
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.renderer.appendChild(document.head, script);
  }
}
