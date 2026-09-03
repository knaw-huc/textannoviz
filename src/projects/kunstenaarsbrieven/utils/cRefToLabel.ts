/**
 * Converts a cRef like "bible-2 Cor/6/10/" into a label like "2 Cor 6:10"
 * Mirrors the awk-script by Bram: https://gitlab.huc.knaw.nl/eDITem/van-gogh/-/blob/0ab15c8c218ea969539212b5c9cbd637b9682e98/etc/stam/fromxml/bible_ref_to_label.sh
 */
export function cRefToLabel(cRef: string): string {
  const fields = cRef.split("/");
  const [field1 = "", field2 = "", field3 = "", field4 = ""] = fields;

  const book = field1.replace(/^bible-/, "");

  let label = `${book} ${field2}`;
  if (field3) {
    label += `:${field3}`;
  }
  if (field4) {
    label += `:${field4}`;
  }

  return label;
}
