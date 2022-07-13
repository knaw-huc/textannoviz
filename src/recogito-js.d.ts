type Annotation = any

/**
 * Based on: https://github.com/recogito/recogito-js/issues/26#issuecomment-921638224
 */
declare module "@recogito/recogito-js" {
  interface RecogitoOptions {
    /**
     * REQUIRED the DOM element to make annotate-able or, alternatively, the ID of the element
     */
    content: string | HTMLDivElement;

    /**
     * Set to true to display annotations read-only
     */
    readOnly?: boolean;

    /**
     * For adding custom CSS classes to anntotations (see Formatters)
     */
    formatter?: (annotation: Annotation) => string;

    /**
     * Set the two-character language code for UI localization. Alternatively, use auto to select the language based on the browser setting. See here for a list of currently supported languages.
     */
    locale?: string;

    /**
     * Set this to pre if the content is preformatted text (<pre> tag or white-space: pre CSS style). In pre mode, TextPositionSelectors stored in the annotations will precisely match the text formatting in the markup, whereas positions in html mode will correspond more closely to the character offsets rendered in the browser.
     */
    mode?: "html" | "pre";

    widgets: any,

    relationVocabulary: string[]
  }

  class Recogito {

      constructor(options?: RecogitoOptions);

      /**
     * Adds an annotation programmatically. The annotation format is that of the W3C WebAnnotation model. RecogitoJS requires a TextPositionSelector in the annotation, and will display each TextualBody as a field the popup.
     */
      addAnnotation(annotation: Annotation): void;

      /**
     * Removes an annotation programmatically.
     */
      removeAnnotation(annotation: Annotation): void;

      /**
     * Loads annotations from a JSON-LD source. The method returns a promise, in case you want to do something after the annotations have loaded.
     */
      loadAnnotations(url: string): Promise<Annotation[]>;

      on(event: string, handler: (...args) => void);

      /**
     * Returns all annotations, according to the current rendered state.
     */
      getAnnotations(): Annotation[];

      /**
     * Removes all text and relationship annotations.
     */
      clearAnnotations(): void;

      /**
     * Destroys the RecogitoJS instance, removing all text and relationship annotations and restoring DOM state from before initialization.
     */
      destroy(): void;
  }

}