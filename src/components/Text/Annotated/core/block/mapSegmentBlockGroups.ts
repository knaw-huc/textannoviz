// TODO:
// import type {
//   Group,
//   SegmentBlockGroupMap,
//   SegmentId,
//   WithIdType,
//   Element
// } from "../BlockModel.ts";
//
// export function mapSegmentBlockGroups<T extends WithIdType>(
//   elements: Element<T>[],
//   groups: Group[],
// ): SegmentBlockGroupMap<T> {
//   const segmentToGroup = new Map<SegmentId, Group>()
//   for (const group of groups) {
//     for (const segId of group.body) {
//       segmentToGroup.set(segId, group)
//     }
//   }
//
//   const index: SegmentBlockGroupMap<T> = {}
//
//   function indexElements(
//     elements: Element<T>[],
//     parentBlock?: Element<T>
//   ) {
//     for (const element of elements) {
//       if (element.isBlock) {
//         indexElements(element.children, element)
//       } else {
//         for (const segment of element.segments) {
//           const group = segmentToGroup.get(segment.id)
//           if (group) {
//             index[segment.id] = {
//               segment,
//               group,
//               block: parentBlock ?? element,
//             }
//           }
//         }
//       }
//     }
//   }
//
//   indexElements(elements)
//   return index
// }
