/** Run tests via Node or Bun test runner
 *  - For "scripts:test" in package.json and ad-hoc running from
 *    command line
 *  - Runs always with bailing and allows choosing test runner
 *    (Node or Bun) and reporter (spec or dot(s))
 *    - NB: Especially adding bailing functionality to Node via
 *      additional package advices to prefer a dedicated script
 *  - ! internally async to use "import()" for checking availability
 *      of bailing package if Node is chosen as runner
 *      - Does of course not affect calling script
 *  - params etc. => _helpData
 */
export const tests:(runner:'bun'|'node',reporter?:'dots'|'dot'|'spec',...testfiles:string[])=>Promise<void>;
export type Tests=typeof tests;


/** Data for cli help screen with {@link _helpToTerminal}
 *  - Array of unformated strings to create hardcoded text adjusted
 *    to current terminal screen width
 * - **cliName** - Name of cli
 * - **syntax** - cli signature
 * - **details** - {@link __JsdocDetail |JSDoc details}
 */
export type _HelpData={
  cliName:string,
  syntax:string,
  details:__JsdocDetail[]
};



/** Exit with error
 *  - Displays script name to locate error (if retrievable) and
 *    passed short error information
 * @example
 *    ```js
 *        _errExit();
 *    ```
 * @example
 *    ```js
 *        _errExit('no arguments');
 *    ```
 * @param info - Information to display
 * @returns - no return => writes to console
*/
export const _errExit:(info?:string)=>void;
export type _ErrExit=typeof _errExit;


/** Show help screen and exit
 *  - Mainly for incorrect args, works as by-effect for "--help"
 *    if no explicit "--help" is defined
 *  - Runs {@link _helpToTerminal} with some additional formatting
 * @example
 *    ```js
 *        _helpExit();
 *    ```
*/
export const _helpExit:()=>void;
export type _HelpExit=typeof _helpExit;


/** Create hardcoded cli help screen adjusted to current terminal
 *  screen width
 *  - Reads data from {@link _HelpData}
 * @example
 *    ```js
 *        _helpToTerminal()
 *    ```
 * @example
 *    ```js
 *        _helpToTerminal(4)
 *    ```
 * @param params - Parameter object
 *                 - **indent** - Base indent (indentation inside
 *                   help text will be relative to this), default: 0
 *                 - **maxWidth** - Maximum number of characters per
 *                   line, cannot be greater than current terminal
 *                   width, default: 120
 * @returns - no return => writes to console
 */ 
export const _helpToTerminal:(params?:{indent?:number,maxWidth?:number})=>void;
export type _HelpToTerminal=typeof _helpToTerminal;


/** JSDoc detail
 *  - Formalization of a logical line of a JSDoc block (as opposed
 *    to a raw textual line that may contain only a part of it due
 *    to hard coded "inline line breaks" for readability in raw view
 *  - cf. _JsdocEntry in #jsdoc-to-markdown-section
 * - **tag** - JSDoc tag, prefix "@" as optional display detail but
 *             suggested for skimming
 * - **paramName** - if tag designates a parameter: name to call it
 * - **description** - information, both for a possible tag and
 *                     standalone ("free-form" in JSDoc terms)
 * 
 * @example
 *    ```js
 *      {
 *        description:'Calculating amount of needed fabric',
 *      };
 *    ```
 * @example
 *    ```js
 *      {
 *        tag:'@param',
 *        paramName:'height',
 *        description:'Vertical extent',
 *      };
 *    ```
 * @example
 *    ```js
 *      {
 *        tag:'@returns',
 *        description:'Amount of fabric needed',
 *      };
 *    ```
*/
type __JsdocDetail={
  tag?:string|undefined,
  paramName?:string|undefined,
  description?:string[],
};
